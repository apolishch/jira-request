/*globals process describe it*/

var should = require('should'),
    jira   = require('../lib/index')(process.env.JIRA_HOSTNAME, process.env.JIRA_USERNAME, process.env.JIRA_PASSWORD);

describe('Api test', function() {
  
  var id = null,
      json = {
        "fields": {
          "project": {
            "id": "10561"
          },
          "summary": "Test issue from jir-request",
          "issuetype": {
            "id": "1" // bug
          },
          "customfield_10211": "E9", // product
          "components": [{
            "id": "11082" // "testing"
          }],
          "versions": [{
            "id": "10000" // affected versions
          }]
        }
      };
  
  it('should create issue', function(done){
    jira.create_issue(json, function(err, response) {
      console.log(err);
      console.log(JSON.stringify(response, undefined, 2));
      should.not.exist(err);
      should.exist(response);
      id = response.key;
      done();
    });
  });
  
  it('should get issue', function(done){
    jira.get_issue(id, function(err, response) {
      should.not.exist(err);
      should.exist(response);
      response.key.should.match(id);
      done();
    });
  });

  // it('should update issue', function(done){
  //   jira.update_issue(id, { /* fields to update */ }, function(err, response) {
  //     should.not.exist(err);
  //     should.exist(response);
  //     // check updated value
  //     response.key.should.match(id);
  //     done();
  //   });
  // });
  // 
  // it("should get back a list of issues including updated one", function(done){
  //   jira.get_issues("project='test'", function(err, response) {
  //     if (err) return done(err);
  //     should.not.exist(err);
  //     should.exist(response);
  //     should.exist(response.issues);
  //     for(var item in response.issues){
  //       response.issues[item].key.should.match(/test/i);
  //     }
  //     response.total.should.not.equal(0);
  //     done();
  //   });
  // });
  // 
  // it('should delete issue', function(done){
  //   jira.delete_issue(id, function(err, response) {
  //     should.not.exist(err);
  //     should.exist(response);
  //     response.key.should.match(id);
  //     done();
  //   });
  // });
  
});