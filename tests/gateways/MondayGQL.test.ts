import dotenv from 'dotenv';

import MondayGateway from '../../src/gateways/Monday';
import MondayGQLGateway from '../../src/gateways/MondayGQL';

dotenv.config();

jest.setTimeout(10 * 1000);

let mondayGateway: MondayGateway;

beforeEach(() => {
    mondayGateway = new MondayGQLGateway();
});

test("GET all items IDs", async () => {
    const ids = await mondayGateway.getAllItemsIds(2634404643);
    const typeOfEach = ids.map(id => (typeof id));
    const idsAreNumber = typeOfEach.map(type => type === "number").reduce((ac, el) => (ac && el), true);

    expect(idsAreNumber).toBe(true);
});

test("GET items", async () => {
    const items = await mondayGateway.getItems(2634404643, 1, 10);

    expect(items.length).toBe(10);
});
