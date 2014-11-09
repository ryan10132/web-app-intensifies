var obj = {};
var request = require('request');

var loadBase64Image = function (url, callback) {
  // Required 'request' module
  // Make request to our image url
  request({url: url, encoding: null}, function (err, res, body) {
    if (!err && res.statusCode == 200) {
      // So as encoding set to null then request body became Buffer object
      var base64prefix = 'data:' + res.headers['content-type'] + ';base64,'
      , image = body.toString('base64');
      if (typeof callback == 'function') {
        callback(image, base64prefix);
      }
    } else {
      callback(null, null);
    }
  });
};


obj.getImage = function(url, callback) {
  loadBase64Image(url, callback);
};

module.exports = obj;
