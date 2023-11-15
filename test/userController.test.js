const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');

const { expect } = chai;
chai.use(chaiHttp);

describe('UserController', () => {
    it('should create a new user', async () => {
        const userData = { name: 'John', username: 'john@email.com', password: '123456' };
        const response = await chai
            .request(app)
            .post('/users')
            .send(userData);

        expect(response).to.have.status(201);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('id');
    });

    it('should return an error when creating a user without required parameters', async () => {
        const invalidUserData = { name: 'John', password: '123456' };
        const response = await chai
            .request(app)
            .post('/users')
            .send(invalidUserData);

        expect(response).to.have.status(400);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('error');
    });
});

