import jsum from 'jsum';

import { DDB_TABLE_NAME, MONDAY_BOARD_ID } from "../constants";
import MondayGateway from "../gateways/Monday";
import Repository from "../repositories/Base";

export default class UpdateService {

    constructor(
        private readonly mondayGateway: MondayGateway,
        private readonly repository: Repository
    ) {
    }

    async execute(): Promise<void> {

        const mondayItems = await this.mondayGateway.getAllItems(MONDAY_BOARD_ID);
        const mondayItemsWithHash = mondayItems.map(mondayItem => {
            const hash = jsum.digest(mondayItem, 'SHA256', 'hex');
            return {
                ...mondayItem,
                hash: hash
            };
        })

        const savedItems = await this.repository.getAllItems(DDB_TABLE_NAME);
        const savedItemsWithHash = savedItems.map(savedItem => {
            const hash = jsum.digest(savedItem, 'SHA256', 'hex');
            return {
                ...savedItem,
                hash: hash
            };
        });

        console.time("Update time");

        for (let i = 0; i < mondayItemsWithHash.length; i++) {
            const item = mondayItemsWithHash[i];
            const savedItem = this.getItemById(item.id, savedItemsWithHash);

            if (savedItem && savedItem.hash === item.hash) continue;
            await this.repository.createOrUpdateItem(item.id, item, DDB_TABLE_NAME);
        }

        console.timeEnd("Update time");
    }

    private getItemById(id: number, array: SearchItem[]): SearchItem | null {
        const arrayFiltred = array.filter(({ id: elementId }) => elementId === id);
        if (arrayFiltred.length < 1) return null;
        return arrayFiltred[0];
    }
}

type SearchItem = {
    id: number,
    hash: string,
    [key: string]: any
};
