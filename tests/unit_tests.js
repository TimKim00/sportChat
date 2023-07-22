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

    it('Clear database', async function () {
        await TestUtils.clearUserDatabase();
    });

    it('Test user registration', (done) => {
        const user1 = {
            username: 'test_username',
            password: 'test_password',
            email: "test_email@test.com",
            name: "test_user"
        };

        const admin = {
            username: 'test_admin_username',
            password: 'test_admin_password',
            email: "test_admin_email@test.com",
            name: "test_admin",
            adminStatus: true
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
            .set('Authorization', 'Bearer ' + user1Token)
            .send(user1)
            .end((err, res) => {
                res.should.have.status(200);
                /** The access token should not be valid now. */
                async () => {
                    await Utils.validateToken(user1Token).should.be.false;
                }
                done();
            });
    })

    it('Should change user1\'s information', (done) => {
        const user1 = {
            username: 'test_username',
            password: 'test_password',
            email: "modified@test.com",
            name: "modified_user"
        };
        chai.request(server)
            .post('/auth/login')
            .send(user1)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('accessToken');
                user1Token = res.body.accessToken;

                chai.request(server)
                    .put('/user')
                    .set('Authorization', 'Bearer ' + user1Token)
                    .send(user1)
                    .end((err, res) => {
                        res.should.have.status(201);
                        res.body.should.be.a('object');
                        res.body.email.should.be.equal(user1.email);
                        res.body.name.should.be.equal(user1.name);

                        chai.request(server)
                            .get('/user')
                            .set('Authorization', 'Bearer ' + user1Token)
                            .send({ username: user1.username })
                            .end((err, res) => {
                                res.should.have.status(201);
                                res.body.should.be.a('object');
                                res.body.email.should.be.equal(user1.email);
                                res.body.name.should.be.equal(user1.name);
                                done(); // Signal end of test
                            });
                    });
            });
    });

    it('Should change user1\'s password', async () => { // Make this an async function
        const user1 = {
            username: 'test_username',
            oldPassword: 'test_password',
            newPassword: 'new_password'
        };

        await new Promise((resolve, reject) => {
            chai.request(server)
                .put('/auth/change_password')
                .set('Authorization', 'Bearer ' + user1Token)
                .send(user1)
                .end((err, res) => {
                    if (err) return reject(err);
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    resolve();
                });
        });

        const loginWithOldPassword = new Promise((resolve, reject) => {
            chai.request(server)
                .post('/auth/login')
                .send({ username: user1.username, password: user1.oldPassword })
                .end((err, res) => {
                    if (err) return reject(err);
                    res.should.have.status(401);
                    resolve();
                });
        });

        const loginWithOldToken = new Promise((resolve, reject) => {
            chai.request(server)
                .put('/auth/change_password')
                .set('Authorization', 'Bearer ' + user1Token)
                .end((err, res) => {
                    if (err) return reject(err);
                    res.should.have.status(401);
                    resolve();
                });
        });

        const loginWithNewPassword = new Promise((resolve, reject) => {
            chai.request(server)
                .post('/auth/login')
                .send({ username: user1.username, password: user1.newPassword })
                .end((err, res) => {
                    if (err) return reject(err);
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    resolve();
                });
        });

        // Now we can await on all the promises, which will resolve when each request finishes
        await Promise.all([loginWithOldPassword, loginWithOldToken, loginWithNewPassword]);
    });

    

});
