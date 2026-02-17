import { Injectable } from "@nestjs/common";

import { AppGateway } from "@/app.gateway";
import { StateService } from "@/services/state.service";
import { YoutubeService } from "@/services/youtube.service";
import { TelegramService } from "@/services/telegram.service";

@Injectable()
export class VideoService {
	constructor(
		private appGateway: AppGateway,
		private stateService: StateService,
		private youtubeService: YoutubeService,
		private telegramService: TelegramService
	) {}

	private broadcast(event: string) {
		this.appGateway.broadcast(event, this.stateService.getCurrentState());
	}

	next() {
		const type = this.stateService.state.type;
		if (type === "youtube") return this.youtubeService.next();
		if (type === "telegram") return this.telegramService.next();
		return { success: false, error: "No active media" };
	}

	prev() {
		const type = this.stateService.state.type;
		if (type === "youtube") return this.youtubeService.prev();
		if (type === "telegram") return this.telegramService.prev();
		return { success: false, error: "No active media" };
	}

	pause() {
		this.stateService.state.paused = !this.stateService.state.paused;
		if (this.stateService.state.paused) {
			this.stateService.pauseTime();
		} else {
			this.stateService.resumeTime();
		}
		this.broadcast("video-pause");
		return { success: true };
	}

	seek(time: string) {
		const timeStr = time || "0";
		const isRelative = timeStr.startsWith("p") || timeStr.startsWith("n");
		const cleanTime = isRelative ? timeStr.slice(1) : timeStr;
		const parts = cleanTime.split(":").map(p => parseInt(p));
		const timeDelta =
			parts.length === 3
				? parts[0] * 3600 + parts[1] * 60 + parts[2]
				: parts.length === 2
					? parts[0] * 60 + parts[1]
					: parts[0];

		let seekTime = timeDelta;
		if (isRelative) {
			const currentTime = this.stateService.getCurrentState().time;
			seekTime = timeStr[0] === "p" ? currentTime + timeDelta : currentTime - timeDelta;
		}
		if (isNaN(seekTime) || seekTime < 0) seekTime = 0;
		this.stateService.seekTime(seekTime);
		this.broadcast("video-seek");
		return { success: true };
	}
}
