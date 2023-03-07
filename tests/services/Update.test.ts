import dotenv from 'dotenv';

import UpdateService from '../../src/services/Update';
import MondayGQLGateway from '../../src/gateways/MondayGQL';
import Repository from '../../src/repositories/Base';
import Mocked from '../../src/repositories/Mocked';

dotenv.config();

const repository: Repository = new Mocked();
const mondayGateway = new MondayGQLGateway();

let updateService: UpdateService;

beforeEach(() => {
    updateService = new UpdateService(mondayGateway, repository);
});

jest.setTimeout(200 * 1000);

test("Test update service", async () => {
    console.log("Test update service")
    await updateService.execute();
});
