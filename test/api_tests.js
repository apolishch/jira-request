var should = require('should'),
    jira   = require('../lib/index')(process.env.JIRA_HOSTNAME, process.env.JIRA_USERNAME, process.env.JIRA_PASSWORD);

describe('Api test', function() {
  it('should get record', function(done){
    jira.get_issue('OEP-1234', function(err, response) {
      should.not.exist(err);
      should.exist(response);
      response.key.should.match(/OEP-1234/i);
      done();
    });
  });

  it("should get back a list of issues", function(done){
    jira.get_issues("project='test'", function(err, response) {
      if (err) return done(err);
      should.not.exist(err);
      should.exist(response);
      should.exist(response.issues);
      for(var item in response.issues){
        response.issues[item].key.should.match(/test/i);
      }
      response.total.should.not.equal(0);
      done();
    });
  });
});