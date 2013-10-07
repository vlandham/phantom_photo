var express = require("express");
var phantom = require("phantom");

var app = express();
app.use(express.logger());

var url = "http://www.google.com";
var phantomHelper;

function processPage(status) {
  page.evaluate(function() {return document.title},function(result) {
    console.log('page title is: ' + result);
    phantomHelper.exit();
  });
}

app.get('/', function(request, response) {
  response.send('Hello World!');
  phantom.create(function(ph) {
    phantomHelper = ph;
    ph.createPage(function(page) {
      page.open(url, processPage);
    });
  });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
