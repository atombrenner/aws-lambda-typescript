import Repository, { Item } from "./Base";

const data: Item[] = require('./mockAllItems.json');

export default class DynamoDB implements Repository {

    private data: Item[];

    constructor() {
        this.data = data;
    }

    async createOrUpdateItem(id: number, object: object, tableName: string): Promise<void> {
    }

    async deleteItem(id: number, tableName: string): Promise<void> {
    }

    async getAllItems(tableName: string): Promise<Item[]> {
        return this.data;
    }
}


