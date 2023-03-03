export default interface Repository {
    createOrUpdateItem(id: number, object: object, tableName: string): Promise<void>,
    deleteItem(id: number, tableName: string): Promise<void>,
    getAllItems(tableName: string): Promise<Item[]>,
    getItems(tableName: string, exclusiveStartKey?: any): Promise<GetItemsResult>
}

export interface GetItemsResult {
    items: Item[],
    startKey?: string
}

export interface Item {
    id: number,
    [key: string]: any
}
