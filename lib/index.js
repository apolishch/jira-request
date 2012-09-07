var request=require('request');

var internal_request = function(method, url, headers, body, callback) {
  var options = {
    uri: url,
    method: method,
    json: true
  };

  if ((method === 'PUT' || method === 'POST') && body) options.body = body;
  if (headers) {
    options.headers = {};
    Object.keys(headers).forEach(function(key) {
      if (key === 'Cookie') options.jar = false;
      options.headers[key] = headers[key];
    });
  }

  request(options, function(err, res, body) {
    if (err) return callback(err);
    if (res && res.statusCode !== 200 && res.statusCode !== 201) return callback('Invalid status code '+res.statusCode, body);
    callback(null, body);
  });
};

module.exports = function(host, user, password) {
  var cookie_jar = null;

  var collapse_response = function(callback) {
    return function(err, res, body) {
      if (err) return callback(err, body);
    };
  };

  var get_headers = function(callback) {
    if (typeof cookie_jar === 'undefined' || cookie_jar === null) {
      var body = { username: user, password: password };
      var url = host+'/rest/auth/latest/session';
      internal_request('POST', url, null, body, function(err, res, data) {
        if (err) return callback(err);
        if (res && res.headers && res.headers['set-cookie']) {
          cookie_jar = res.headers['set-cookie'];
          return callback(null, cookie_jar.join(';'));
        }
        callback('No set-cookie header found');
      });
    } else callback(null, { Cookie: cookie_jar.join(';') });
  };

  return {
    get: function(url, callback) {
      get_headers(function(err, headers) {
        var request_url = host+url;
        internal_request('GET', request_url, headers, null, callback);
      });
    },
    put: function(url, body, callback) {
      get_headers(function(err, headers) {
        var request_url = host+url;
        internal_request('PUT', request_url, headers, body, callback);
      });
    },
    post: function(url, body, callback) {
      get_headers(function(err, headers) {
        var request_url = host+url;
        internal_request('POST', request_url, headers, body, callback);
      });
    },
    del: function(url, callback) {
      get_headers(function(err, headers) {
        var request_url = host+url;
        internal_request('DELETE', request_url, headers, null, callback);
      });
    },
    get_issues: function(jql, callback) {
      this.get('/rest/api/latest/search?jql='+jql, callback);
    },
    get_issue: function(id, callback) {
      this.get('/rest/api/latest/issue/'+id, callback);
    }
  };  
};