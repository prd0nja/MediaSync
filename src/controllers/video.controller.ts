import { Controller, Post, Query } from "@nestjs/common";

import { VideoService } from "@/services/video.service";

@Controller("api/video")
export class VideoController {
	constructor(private videoService: VideoService) {}

	@Post("next")
	next() {
		return this.videoService.next();
	}

	@Post("prev")
	prev() {
		return this.videoService.prev();
	}

	@Post("pause")
	pause() {
		return this.videoService.pause();
	}

	@Post("seek")
	seek(@Query("time") time: string) {
		return this.videoService.seek(time);
	}
}
