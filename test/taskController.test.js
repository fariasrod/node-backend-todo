const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');

const { expect } = chai;
chai.use(chaiHttp);

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlJvZHJpZ28gRmFyaWFzIiwiaWF0IjoxNzAwMDUxNzYwLCJleHAiOjE3MzE1ODc3NjB9.1nt6R68cyC0HFeCipfv7Jj05AKIhHmcDuRP5fEzl_js';

describe('TaskController', () => {
    it('should create a new task', async () => {
        const userData = { name: 'John', username: 'john@email.com', password: '123456' };
        const userResponse = await chai
            .request(app)
            .post('/users')
            .send(userData)
            .set('Authorization', `Bearer ${token}`);

        const projectData = { name: 'Test Project', user: userResponse.body.id };
        const projectResponse = await chai
            .request(app)
            .post('/projects')
            .send(projectData)
            .set('Authorization', `Bearer ${token}`);

        const taskData = { description: 'Test Task', project_id: projectResponse.body.id };
        const taskResponse = await chai
            .request(app)
            .post('/tasks')
            .send(taskData)
            .set('Authorization', `Bearer ${token}`);

        expect(taskResponse).to.have.status(201);
        expect(taskResponse.body).to.be.an('object');
        expect(taskResponse.body).to.have.property('id');
        expect(taskResponse.body.description).to.equal('Test Task');
        expect(taskResponse.body.is_done).to.equal(0);
    });

    it('should update an existing task', async () => {
        const taskData = { description: 'Updated Task', is_done: true };
        const response = await chai
            .request(app)
            .put('/tasks/1')
            .send(taskData)
            .set('Authorization', `Bearer ${token}`);

        expect(response).to.have.status(200);
        expect(response.body).to.be.an('object');
        expect(response.body.description).to.equal('Updated Task');
        expect(response.body.is_done).to.equal(1);
    });

    it('should delete an existing task', async () => {
        const response = await chai
            .request(app)
            .delete('/tasks/1')
            .set('Authorization', `Bearer ${token}`);

        expect(response).to.have.status(204);
        const getResponse = await chai.request(app).get('/tasks/1');
        expect(getResponse).to.have.status(404);
    });

    it('should return an error when creating a task without required parameters', async () => {
        const invalidData = { description: 'Test Task' };
        const response = await chai
            .request(app)
            .post('/tasks')
            .send(invalidData)
            .set('Authorization', `Bearer ${token}`);

        expect(response).to.have.status(400);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('error');
    });

    it('should return an error when updating a task without required parameters', async () => {
        const invalidData = { description: 'Test Task' };
        const response = await chai
            .request(app)
            .put('/tasks/1')
            .send(invalidData)
            .set('Authorization', `Bearer ${token}`);

        expect(response).to.have.status(400);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('error');
    });
});