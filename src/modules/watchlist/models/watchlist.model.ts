import {Column, ForeignKey, Table, Model} from "sequelize-typescript";
import {User} from "../../user/models/user.model";

@Table
export class Watchlist extends Model<Watchlist> {

	@ForeignKey(() => User)
	user: User

	@Column
	name: string

	@Column
	assetId: string
}