const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');

const { expect } = chai;
chai.use(chaiHttp);

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlJvZHJpZ28gRmFyaWFzIiwiaWF0IjoxNzAwMDUxNzYwLCJleHAiOjE3MzE1ODc3NjB9.1nt6R68cyC0HFeCipfv7Jj05AKIhHmcDuRP5fEzl_js';

describe('ProjectController', () => {
    it('should create a new project', async () => {
        const userData = { name: 'John', username: 'john@email.com', password: '123456' };
        const userResponse = await chai
            .request(app)
            .post('/users')
            .send(userData)
            .set('Authorization', `Bearer ${token}`);

        const projectData = { name: 'Test Project', user: userResponse.body.id };
        const response = await chai
            .request(app)
            .post('/projects')
            .send(projectData)
            .set('Authorization', `Bearer ${token}`);

        expect(response).to.have.status(201);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('id');
        expect(response.body.name).to.equal('Test Project');
    });

    it('should update an existing project', async () => {
        const projectData = { name: 'Updated Project' };
        const response = await chai
            .request(app)
            .put('/projects/1')
            .send(projectData)
            .set('Authorization', `Bearer ${token}`);

        expect(response).to.have.status(200);
        expect(response.body).to.be.an('object');
        expect(response.body.name).to.equal('Updated Project');
    });

    it('should return all projects by userId', async () => {
        const response = await chai
            .request(app)
            .get('/projects/user/1')
            .set('Authorization', `Bearer ${token}`);
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('array');
    });

    it('should delete an existing project', async () => {
        const response = await chai
            .request(app)
            .delete('/projects/1')
            .set('Authorization', `Bearer ${token}`);

        expect(response).to.have.status(204);
        const getResponse = await chai.request(app).get('/projects/1');
        expect(getResponse).to.have.status(404);
    });

    it('should return an error when creating a project without required parameters', async () => {
        const invalidData = { name: 'Test Project' };
        const response = await chai
            .request(app)
            .post('/projects')
            .send(invalidData)
            .set('Authorization', `Bearer ${token}`);

        expect(response).to.have.status(400);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('error');
    });

    it('should return an error when updating a project without required parameters', async () => {
        const invalidData = {};
        const response = await chai
            .request(app)
            .put('/projects/1')
            .send(invalidData)
            .set('Authorization', `Bearer ${token}`);

        expect(response).to.have.status(400);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('error');
    });
});