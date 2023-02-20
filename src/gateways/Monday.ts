import { GetAllItemsResponseItemToReturn } from "./MondayGQL"

export default interface MondayGateway {
    getAllItemsIds(boardId: number): Promise<number[]>
    getItems(boardId: number, page: number, limit: number): Promise<GetAllItemsResponseItemToReturn[]>
}
