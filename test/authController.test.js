const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const jwt = require('jsonwebtoken');

const { expect } = chai;
chai.use(chaiHttp);

describe('AuthController', () => {
    it('should return a valid token for a successful login', async () => {

        const userData = { name: 'John', username: 'john@email.com', password: '123456' };
        await chai
            .request(app)
            .post('/users')
            .send(userData);

        const response = await chai
            .request(app)
            .post('/login')
            .send({ username: 'john@email.com', password: '123456' });

        expect(response).to.have.status(200);
        expect(response.body).to.have.property('token');

        const decodedToken = jwt.verify(response.body.token, 'fa9a6937e040ad136cc7740fec652b87');
        expect(decodedToken).to.have.property('id', 1);
        expect(decodedToken).to.have.property('name', 'John');
    });

    it('should return an error for an invalid login', async () => {
        const response = await chai
            .request(app)
            .post('/login')
            .send({ username: 'nonexistentuser', password: 'invalidpassword' });

        expect(response).to.have.status(401);
        expect(response.body).to.have.property('message', 'login invalid');
    });
});