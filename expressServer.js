'use strict'; //stricter JS

const fs = require('fs'); //require fs module
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');

const express = require('express');
const app = express();
const port = 8000;

app.get('/pets', (req, res) => {
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if (err) {
      return err;
    }

    let pets = JSON.parse(data);

    return res.status(200).send(pets);
  });
});

app.get('/pets/:id', (req, res) => { // create instance of Express
  fs.readFile(petsPath, 'utf8', function(err, data) { //use fs nodule to look at data
    if (err) { // if error crops up
      console.error(err.stack); //log it
      return res.sendStatus(500); // and send a 500 status code into the response
    }

    let pets = JSON.parse(data); //parse the data into JSON, assign that to 'pets' var
    let idx = Number.parseInt(req.params.id); //parse the index var within the path
    let pet = pets[idx]; //target one pet at the idx of the json data

    if (idx > pets.length-1 || idx < 0 || Number.isNaN(idx)) { //if that idx is out of range, less than 0, or idx isn't a number...
      res.set('Content-Type', 'text/plain');
      return res.status(404).send('Not Found'); //return 404 error as response status code
    }

    res.set('Content-Type', 'application/json'); //set Content-Type header
    return res.status(200).send(pet); //return pet as response obj
  });
});

app.use(function(req, res) {
  res.sendStatus(404);
});

app.listen(port, () => {
  console.log('Listening on ' + port);
});

module.exports = app;
