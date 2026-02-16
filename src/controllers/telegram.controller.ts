import { Controller, Get, Post, Query, Res, Headers } from "@nestjs/common";
import type { Response } from "express";

import { TelegramService } from "@/services/telegram.service";

@Controller("api/telegram")
export class TelegramController {
	constructor(private telegramService: TelegramService) {}

	@Post("channel")
	channel(@Query("name") name: string, @Query("limit") limit?: string) {
		return this.telegramService.setChannel(name, parseInt(limit || "50"));
	}

	@Post("video")
	video(@Query("messageId") messageId: string) {
		return this.telegramService.video(parseInt(messageId));
	}

	@Get("stream")
	stream(@Headers("range") range: string, @Res() res: Response) {
		return this.telegramService.stream(range, res);
	}
}
