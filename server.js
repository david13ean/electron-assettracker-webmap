const http = require('http');
var express = require('express');
var app = express();
const bodyParser= require('body-parser');
const mongoose = require('mongoose');
var path = require('path');
var Particle = require('particle-api-js');
const port = 3000;
var particle = new Particle();

require('./db');
var GPSchema = new mongoose.Schema({
  device: String,
  data: String,
  published_at: String
});
var GPModel= mongoose.model('GPModel', GPSchema);

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/assettracker.html'));
});

app.listen(8080);
const requestHandler = (request, response) => {
  // console.log(request.url)
  response.end('Hello Node.js Server!');
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`);
})

app.get('/positions', function(req, res, next) {
  GPModel.find(function (err, positions) {
    if (err) return console.error(err);
    console.log(positions);
    res.send(positions);
  });
});

app.post('/stream', function(req, res) {
  particle.getEventStream({ deviceId: req.body[1], name: "g", auth: req.body[0] }).then(function(stream) {
    stream.on('event', function(data) {
      console.log("Event: ", data);
      var pos = new GPModel({ device: req.body[1], data: data.data, published_at: data.published_at });
      pos.save(function (err, pos) {
        if (err) return console.error(err);
      });
    });
  });
});

app.post('/arm', function(req, res) {
  console.log(req.body[0]);
  var fnPr = particle.callFunction({ deviceId: req.body[1], name: 'armToggl', argument: req.body[3], auth: req.body[0] });
  
  fnPr.then(
    function(data) {
      console.log('Function called succesfully:', data);
    }, function(err) {
      console.log('An error occurred:', err);
    });
});

app.post('/silence', function(req, res) {
  console.log(req.body[0]);
  
  var fnPr = particle.callFunction({ deviceId: req.body[1], name: 'silenceToggl', argument: req.body[3], auth: req.body[0] });
  
  fnPr.then(
    function(data) {
      console.log('Function called succesfully:', data);
    }, function(err) {
      console.log('An error occurred:', err);
    });
});