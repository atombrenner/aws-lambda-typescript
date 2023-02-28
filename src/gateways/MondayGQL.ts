import MondayGateway from "./Monday";

import { GraphQLClient, gql } from "graphql-request"

import { BASEURL_MONDAY } from "../constants";

export default class MondayGQLGateway implements MondayGateway {
    graphQLClient: GraphQLClient;

    constructor() {
        this.graphQLClient = new GraphQLClient(BASEURL_MONDAY, {
            headers: {
                Authorization: process.env.TOKEN_MONDAY || ""
            }
        });
    }

    async getAllItemsIds(boardId: number): Promise<number[]> {
        const query = gql`
            query {
                boards(ids: ${boardId}) {
                    items {
                        id
                    }
                }
            }
        `;

        return this.graphQLClient.request(query)
            .then(result => {
                const response: GetItemsResponse = result;
                const board = response.boards[0];
                const itemsIds = board.items.map(item => parseInt(item.id));
                return itemsIds;
            });
    }

    async getItems(boardId: number, page: number, limit: number): Promise<GetItemsResponseItemToReturn[]> {
        const query = gql`
            query {
                boards(ids: ${boardId}) {
                    items(limit: ${limit}, page: ${page}) {
                        id,
                        column_values(ids: []) {
                            id,
                            value,
                            text
                        }
                    }
                }
            }
        `;

        return this.graphQLClient.request(query)
            .then(result => {
                const response: GetItemsResponse = result;
                const board = response.boards[0];
                const items = board.items.map(item => ({
                    ...item,
                    id: parseInt(item.id)
                }));
                return items;
            });
    }

    async getAllItems(boardId: number): Promise<GetItemsResponseItemToReturn[]> {
        const allItems = [];

        let hasPagination = false;
        let page = 1;
        const limit = 500;

        do {
            const moreItems = await this.getItems(boardId, page, limit);
            allItems.push(...moreItems);

            hasPagination = moreItems.length === limit;
            if (hasPagination) page += 1;

        } while (hasPagination);

        return allItems;
    }
}

interface GetItemsResponse {
    boards: GetItemsResponseBoard[]
}

interface GetItemsResponseBoard {
    items: GetItemsResponseItem[]
}

interface GetItemsResponseItem {
    id: string,
    column_values?: GetItemsResponseColumnValue[]
}

export interface GetItemsResponseItemToReturn {
    id: number,
    column_values?: GetItemsResponseColumnValue[]
}

interface GetItemsResponseColumnValue {
    id: string,
    value: string | null
}
