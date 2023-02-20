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
                const response: GetAllItemsResponse = result;
                const board = response.boards[0];
                const itemsIds = board.items.map(item => parseInt(item.id));
                return itemsIds;
            });
    }

    async getItems(boardId: number, page: number, limit: number): Promise<GetAllItemsResponseItemToReturn[]> {
        const query = gql`
            query {
                boards(ids: ${boardId}) {
                    items(limit: ${limit}, page: ${page}) {
                        id,
                        column_values(ids: []) {
                            id,
                            value
                        }
                    }
                }
            }
        `;

        return this.graphQLClient.request(query)
            .then(result => {
                const response: GetAllItemsResponse = result;
                const board = response.boards[0];
                const items = board.items.map(item => ({
                    ...item,
                    id: parseInt(item.id)
                }));
                return items;
            });
    }
}

interface GetAllItemsResponse {
    boards: GetAllItemsResponseBoard[]
}

interface GetAllItemsResponseBoard {
    items: GetAllItemsResponseItem[]
}

interface GetAllItemsResponseItem {
    id: string,
    column_values?: GetAllItemsResponseColumnValue[]
}

export interface GetAllItemsResponseItemToReturn {
    id: number,
    column_values?: GetAllItemsResponseColumnValue[]
}

interface GetAllItemsResponseColumnValue {
    id: string,
    value: string | null
}
