import { DDB_TABLE_NAME, MONDAY_BOARD_ID } from "../constants";
import Repository, { GetItemsResult } from "../repositories/Base";

export default class GetService {

    constructor(
        private readonly repository: Repository
    ) {
    }

    async execute(startKey?: number): Promise<GetItemsResult> {
        const items = await this.repository.getItems(DDB_TABLE_NAME, startKey);
        return items;
    }
}
