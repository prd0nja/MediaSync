import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppGateway } from "./app.gateway";
import { YoutubeController } from "./controllers/youtube.controller";
import { TelegramController } from "./controllers/telegram.controller";
import { VideoController } from "./controllers/video.controller";
import { StateService } from "./services/state.service";
import { BrowserService } from "./services/browser.service";
import { YoutubeService } from "./services/youtube.service";
import { TelegramService } from "./services/telegram.service";

@Module({
	controllers: [YoutubeController, TelegramController, VideoController],
	providers: [AppGateway, StateService, BrowserService, YoutubeService, TelegramService],
	imports: [
		ConfigModule.forRoot({
			envFilePath:
				process.env.NODE_ENV === "production" ? ".env.production" : ".env.development"
		})
	]
})
export class AppModule {}
