const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    this.timeout(5000);

    /*let validId;

        before(async function () {

            const res = await chai
                .request(server)
                .post('/api/issues/MyProject')
                .send({
                    issue_title: 'Test Issue',
                    issue_text: 'Test Text',
                    created_by: 'Test User'
                });

            validId = res.body._id;
        });

    //Test #1
    test('Create an issue with every field: POST request to /api/issues/{project}', function (done) {
        chai
            .request(server)
            .keepOpen()
            .post('/api/issues/MyProject')
            .send({ 
                issue_title: "First",
                issue_text: "This is the first one of all",
                created_by: "Diego Brando",
                assigned_to: "No one",
                status_text: "what goes here?"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.issue_title, "First");
                assert.equal(res.body.issue_text, "This is the first one of all");
                assert.equal(res.body.created_by, "Diego Brando");
                assert.equal(res.body.status_text, "what goes here?");
                done();
            });
    });

    //Test #2
    test('Create an issue with only required fields: POST request to /api/issues/{project}', function (done) {
        chai
            .request(server)
            .keepOpen()
            .post('/api/issues/MyProject')
            .send({
                issue_title: "Second",
                issue_text: "Only required fields!",
                created_by: "Diego Brando"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.issue_title, "Second");
                assert.equal(res.body.issue_text, "Only required fields!");
                assert.equal(res.body.created_by, "Diego Brando");
                done();
            });
    });

    //Test #3
    test('Create an issue with missing required fields: POST request to /api/issues/{project}', function(done) {
        chai    
            .request(server)
            .keepOpen()
            .post('/api/issues/MyProject')
            .send({
                issue_title: "Third",
                issue_text: '',
                created_by: 'Diego Brando'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, {error: 'required field(s) missing' });
                done();
            });
    });

    //Test #3.5
    test('View issues on a project: GET request to /api/issues/{project}', function (done) {
        chai
            .request(server)
            .keepOpen()
            .get('/api/issues/MyProject')
            .end(function (err, res) {
                assert.isArray(res.body);
                done();
            });
    });    

    //Test #4
    test('View issues on a project with one filter: GET request to /api/issues/{project}', function (done) {
        chai
            .request(server)
            .keepOpen()
            .get('/api/issues/MyProject')
            .query({ created_by: "Test User" })
            .end(function (err, res) {
                assert.isArray(res.body);
                const found = res.body.some(issue => issue.created_by === "Test User");
                assert.isTrue(found, 'No issue found with created_by "Test User"');
                done();
            });
    });

    //Test #5
    test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function (done) {
        chai
            .request(server)
            .keepOpen()
            .get('/api/issues/MyProject')
            .query({ 
                created_by: "Test User", 
                issue_text: "Test Text"
            })
            .end(function (err, res) {
                assert.isArray(res.body);
                const found = res.body.some(issue => issue.created_by === "Test User" && issue.issue_text === "Test Text");
                assert.isTrue(found, 'No issue found matching both filters');
                done();
            });
    });

    //Test #6
    test('Update one field on an issue: PUT request to /api/issues/{project}', function (done) {
        chai
            .request(server)
            .keepOpen()
            .put('/api/issues/MyProject')
            .send({
                _id: validId,
                issue_text: 'Updated issue text'
            })
            .end(function (err, res) {
                assert.deepEqual(res.body, {
                    result: 'successfully updated',
                    _id: validId
                });
                done();
            });
    });

    //Test #7
    test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function (done) {
        chai
            .request(server)
            .keepOpen()
            .put('/api/issues/MyProject')
            .send({
                _id: validId,
                issue_text: 'Updated issue text (again)',
                assigned_to: 'Diego Brando'
            })
            .end(function (err, res) {
                assert.deepEqual(res.body, {
                    result: 'successfully updated',
                    _id: validId
                });
                done();
            });
    });

    //Test #8
    test('Update an issue with missing _id: PUT request to /api/issues/{project}', function (done) {
        chai
            .request(server)
            .keepOpen()
            .put('/api/issues/MyProject')
            .send({
                _id: '',
                issue_text: 'Updating with no id'
            })
            .end(function (err, res) {
                assert.deepEqual(res.body, {
                    error: 'missing _id',
                });
                done();
            });
    });

    //Test #9
    test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function (done) {
        chai
            .request(server)
            .keepOpen()
            .put('/api/issues/MyProject')
            .send({_id: "68c0918b750cec281f57ecad"})
            .end(function (err, res) {
                assert.deepEqual(res.body, {
                    error: 'no update field(s) sent', 
                    _id: "68c0918b750cec281f57ecad"
                });
                done();
            });
    });
    
    //Test #10
    test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function (done) {
        chai
            .request(server)
            .keepOpen()
            .put('/api/issues/MyProject')
            .send({_id: "asdsadadas"})
            .end(function (err, res) {
                assert.deepEqual(res.body, {
                    error: 'could not update', 
                    '_id': "asdsadadas"
                });
                done();
            });
    });

    //Test #11  
    test('Delete an issue: DELETE request to /api/issues/{project}', function (done) {
    chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/MyProject')
        .send({
            _id: validId
        })
        .end(function (err, res) {
            assert.deepEqual(res.body, {
                result: 'successfully deleted',
                _id: validId
            });
            done();
        });
    });
    
    //Test #12
    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function (done) {
    chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/MyProject')
        .send({
            _id: "invalidId"
        })
        .end(function (err, res) {
            assert.deepEqual(res.body, {
                error: 'could not delete',
                _id: "invalidId"
            });
            done();
        });
    });

    //Test #13
    test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function (done) {
    chai
        .request(server)
        .keepOpen()
        .delete('/api/issues/MyProject')
        .send({
            _id: ""
        })
        .end(function (err, res) {
            assert.deepEqual(res.body, {
                error: 'missing _id',
            });
            done();
        });
    });*/

});
