import Base from '../../src/repositories/Base';
import DynamoDB from '../../src/repositories/DynamoDB';

let repository: Base;

beforeEach(() => {
    repository = new DynamoDB();
})

test("Test DDB Repository", async () => {
    const allItems = await repository.getAllItems('ClientesMondayCRMGeral');

    const itemId = generateAleatoryBigNumber();
    await repository.createOrUpdateItem(itemId, {}, 'ClientesMondayCRMGeral');

    await repository.deleteItem(itemId, 'ClientesMondayCRMGeral');
});

const generateAleatoryBigNumber = () => {
    const min = 10 ** 8;
    const max = 10 ** 9;
    const delta = max - min;
    const randNumber = (Math.random() * delta) + min;
    return randNumber;
}
