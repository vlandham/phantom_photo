var express = require("express");
var phantom = require("phantom");
var renderElement = require('./renderElement.js');

var app = express();
app.use(express.logger());

var url = "http://www.google.com";
var phantomHelper;


app.get('/:user_id', function(request, response) {
  var user_id = request.params.format;

  phantom.create(function(ph) {
    phantomHelper = ph;

    ph.createPage(function(page) {
      function processPage(status) {
        page.viewportSize = { width: 600, height: 600 };
        page.evaluate(function() {return document.title}, function(result) {
          // console.log('page title is: ' + result);
          // var pic = renderElement(page, '#vis');
          page.renderBase64('png', function(pic) {
            var buf = new Buffer(pic, 'base64');

            response.writeHead(200, {'Content-Type': 'image/png' });
            response.end(buf, 'binary');


            // response.send(buf);

          });
          phantomHelper.exit();
        });
      };

      page.open(url, processPage);
      // response.send('Hello World!');
    });
  });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
