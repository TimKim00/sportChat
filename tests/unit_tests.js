/**
 * Started as a unit test but became integration test
 * For the most part. 
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const TestUtils = require('./test_utils');
const Utils = require('../src/utils/utils');

require('dotenv').config();
const server = process.env.SERVER_ADDRESS;

chai.should();
chai.use(chaiHttp);

describe('Unit tests for user management', () => {
    let user1Token = '';
    let new_user1Token = '';

    it('Clear database', async function() {
        await TestUtils.clearUserDatabase();
    });

    it('Test user registration', (done) => {
        const user1 = {
            username: 'test_username',
            password: 'test_password',
            email: "test_email@test.com",
            name: "test_user"
        };

        chai.request(server)
            .post('/auth/register')
            .send(user1)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('accessToken');
                res.body.should.have.property('userInfo');
                res.body.userInfo.username.should.be.equal(user1.username);
                res.body.userInfo.email.should.be.equal(user1.email);
                res.body.userInfo.name.should.be.equal(user1.name);
                res.body.userInfo.adminStatus.should.be.equal(false);
            });

        const admin = {
            username: 'test_admin_username',
            password: 'test_admin_password',
            email: "test_admin_email@test.com",
            name: "test_admin",
            adminStatus: true
        };
    
        chai.request(server)
            .post('/auth/register')
            .send(admin)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('accessToken');
                res.body.should.have.property('userInfo');
                res.body.userInfo.username.should.be.equal(admin.username);
                res.body.userInfo.email.should.be.equal(admin.email);
                res.body.userInfo.name.should.be.equal(admin.name);
                res.body.userInfo.adminStatus.should.be.equal(true);
                done();
            });
    });

    it('Should login user1', (done) => {
        const user1 = {
            username: 'test_username',
            password: 'test_password'
        };

        chai.request(server)
            .post('/auth/login')
            .send(user1)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('accessToken');
                user1Token = res.body.accessToken;
                done();
            });
    })

    it('Should logout of user1', (done) => {
        const user1 = {
            username: 'test_username'
        };

        chai.request(server)
            .get('/auth/logout')
            .send(user1)
            .end((err, res) => {
                res.should.have.status(204);
                /** The access token should not be valid now. */
                async () => {
                    await Utils.validateToken(user1Token).should.be.false;
                }
                done();
            });
    })

});
