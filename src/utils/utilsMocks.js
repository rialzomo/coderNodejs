import { Faker, es } from '@faker-js/faker';

const faker = new Faker({ locale: [es] })

export const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productAdjective(),
        code: faker.string.alphanumeric(10),
        price: faker.commerce.price(),
        status: true,
        category: faker.commerce.department(),
        thumbnail: faker.image.image(),
        stock: +faker.string.numeric(1),
        id: faker.database.mongodbObjectId(),
        // image: faker.image.image(),
    }
}