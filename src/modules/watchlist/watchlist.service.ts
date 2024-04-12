import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Watchlist} from "./models/watchlist.model";
import {CreateAssetResponse} from "./response";
import {WatchListDTO} from "./dto";

@Injectable()
export class WatchlistService {
	constructor(@InjectModel(Watchlist) private readonly watchlistRepository: typeof Watchlist) {}

	async createAsset(userId, dto: WatchListDTO): Promise<CreateAssetResponse> {
		const newWatchlist = {
			user: userId,
			name: dto.name,
			assetId: dto.assetId
		}
		await this.watchlistRepository.create(newWatchlist);
		return newWatchlist;
	}

	async deleteAsset(userId: string, assetId: string): Promise<boolean> {
		await this.watchlistRepository.destroy({ where: {id: assetId, user: userId}})
		return true;
	}
}
