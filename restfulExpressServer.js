'use strict'; //stricter JS

const fs = require('fs'); //require fs module
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const port = 8000;

app.use(bodyParser.json());
app.use(morgan('common'));

app.get('/pets', (req, res) => {
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if (err) {
      console.error(err.stack); //log it
      return res.sendStatus(500); // and send a 500 status code into the response
    }

    let pets = JSON.parse(data);
    console.log(pets);
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
    //console.log(pet);
    if (idx > pets.length-1 || idx < 0 || Number.isNaN(idx)) { //if that idx is out of range, less than 0, or idx isn't a number...
      res.set('Content-Type', 'text/plain'); //create header for content type
      return res.status(404).send('Not Found'); //return 404 error as response status code
    }

    res.set('Content-Type', 'application/json'); //set Content-Type header
    return res.status(200).send(pet); //return pet as response obj
  });
});

app.post('/pets', (req, res) => {
  fs.readFile(petsPath, 'utf8', (readErr, data) => {
    if (readErr) {
      console.error(readErr.stack);
      return res.sendStatus(500);
    }

    let pets = JSON.parse(data);
    let newPet = {
      'age': Number.parseInt(req.body.age),
      'kind': req.body.kind,
      'name': req.body.name
    }

    if (!newPet.age || !newPet.kind || !newPet.name || Number.isNaN(newPet.age)) {
      res.set('Content-Type', 'text/plain');
      return res.status(400).send('Bad Request');
    }

    pets.push(newPet);

    let petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, (writeErr) => {
      if (writeErr) {
        console.error(writeErr.stack);
        return res.sendStatus(500);
      }

      res.set('Content-Type', 'application/json');
      res.status(200).send(newPet);
    });

  });
});

app.patch('/pets/:id', (req, res) => {
  fs.readFile(petsPath, 'utf8', (readErr, data) => {
    if (readErr) {
      console.error(readErr.stack);
      return res.sendStatus(500);
    }

    let pets = JSON.parse(data); // parse object from data
    let idx = Number.parseInt(req.params.id); //parse index from req body
    let petToFix = pets[idx]; // target the pet to modify
    let newName = req.body.name;
    let newAge = req.body.age;
    let newKind = req.body.kind;
    if (newName) {
      petToFix.name = newName;
    }
    if (newAge) {
      petToFix.age = Number.parseInt(newAge);
    }
    if (newKind) {
      petToFix.kind = newKind;
    }

    let petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, (writeErr) => {
      if (writeErr) {
        console.error(writeErr.stack);
        return res.sendStatus(500);
      }

      res.set('Content-Type', 'application/json');
      res.status(200).send(petToFix);
    });
  });
});

app.delete('/pets/:id', (req, res) => {
  fs.readFile(petsPath, 'utf8', (readErr, data) => {
    if (readErr) {
      console.error(readErr.stack);
      return res.sendStatus(500);
    }

    let pets = JSON.parse(data); // parse object from data
    let idx = Number.parseInt(req.params.id); //parse index from req body
    let unwantedPet = pets[idx]; // target the pet to modify
    let filteredPets = pets.filter( (pet) => { return !unwantedPet }); // filter the unwantedPet out of the pets object
    console.log(filteredPets);
    let petsJSON = JSON.stringify(filteredPets);

    fs.writeFile(petsPath, petsJSON, (writeErr) => {
      if (writeErr) {
        console.error(writeErr.stack);
        return res.sendStatus(500);
      }

      res.set('Content-Type', 'application/json');
      res.status(200).send(unwantedPet);
    });
  });
});

app.use( (req, res) => {
  res.sendStatus(404);
});

app.listen(port, () => {
  console.log('Listening on ' + port);
});

module.exports = app;
