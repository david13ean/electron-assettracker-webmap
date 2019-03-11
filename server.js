// content of index.js
const http = require('http');
var express = require('express');
var app = express();
var path = require('path');
var Particle = require('particle-api-js');
const port = 3000;
var particle = new Particle();
var token;

app.configure(function(){
  app.use(express.bodyParser());
  app.use(app.router);
});
// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendfile(path.join(__dirname + '/assettracker.html'));
});

app.post('/arm', function(req, res) {
  console.log(req.body[0]);
  // res.send(200);
  particleArm(req);
});

app.listen(8080);
const requestHandler = (request, response) => {
  console.log(request.url)
  response.end('Hello Node.js Server!')
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})

function particleArm(req) {
  var fnPr = particle.callFunction({ deviceId: req.body[2], name: 'armToggle', argument: 'on', auth: req.body[0] });
  
  fnPr.then(
    function(data) {
      console.log('Function called succesfully:', data);
    }, function(err) {
      console.log('An error occurred:', err);
    });
}