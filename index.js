var express = require('express');
var app = express();
var request = require('request');
var imageGetter = require('./imageGetter.js');

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))



app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})

app.get('/intensifyURL', function(request, response) {
    var url = request.query.url;
    imageGetter.getImage(url, function (image, prefix) {
      if (image !== null) {
        response.send('<img src="' + prefix + image + '"/>');
      } else {
        response.status(500).send("error");
      }
    });
});
