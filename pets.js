'use strict';

let fs = require('fs');
let path = require('path');
let petsPath = path.join(__dirname, 'pets.json');

//define terminal options
let node = path.basename(process.argv[0]);
let file = path.basename(process.argv[1]);
let cmd = process.argv[2];
let option1 = process.argv[3];
let option2 = process.argv[4];
let option3 = process.argv[5];
let option4 = process.argv[6];
let databaseUsage = `Usage: ${node} ${file} [read | create | update | destroy]`;

//refactoring everything after 'below'
if (cmd === 'read' || cmd === 'create' || cmd === 'update' || cmd === 'destroy') {
  fs.readFile(petsPath, 'utf8', (readErr, data) => { //only one readFile function
    if (readErr) { throw readErr; } //error detection
    //set terminal options to correct variable names
    let optIdx, optAge, optKind, optName;
    if (cmd !== 'create') {
      optIdx = option1, optAge = option2, optKind = option3, optName = option4;
    } else {
      optAge = option1, optKind = option2, optName = option3;
    }
    let pets = JSON.parse(data); //parse data into object
    let pet  = pets[optIdx]; //target a specific pet
    if (cmd === 'destroy') { pet = pets.splice(optIdx, 1); } // override object & indexed element for destroy cmd
    let newPet = { age: parseInt(optAge), kind: `${optKind}`, name: `${optName}` }; // create/update object creation
    //define usage string interpolations for error detections found later on
    let indexUsage = `Usage: ${node} ${file} ${cmd} INDEX`, optionsUsage = `Usage: ${node} ${file} ${cmd} AGE KIND NAME`, deluxeUsage = `Usage: ${node} ${file} ${cmd} INDEX AGE KIND NAME`;

    if (cmd === 'read') {
      if (optIdx>pets.length-1 || optIdx<0) {
        console.error(indexUsage);
        process.exit(1);
      } else if (!optIdx) {
        console.log(pets); // without a target index, print them all out
      } else {
        console.log(pet); // if specification desired, deliver it
      }
    } else {
      if (cmd === 'create') {
        if (!optAge || !optKind || !optName) {
          console.error(optionsUsage); //optionsUsage
          process.exit(1);
        }
        pets.push(newPet); //give the pets inventory the newPet
        pet = newPet;// identify pet for writeFile
      } else if (cmd === 'update') {
        if (!optIdx || !optAge || !optKind || !optName) { //deluxeUsage
          console.error(deluxeUsage);
          process.exit(1);
        }
        pets[optIdx] = newPet; pet = newPet;// identify pet for writeFile
      } else if (cmd === 'destroy') {
        if (!optIdx) {
          console.error(indexUsage);
          process.exit(1);
        }
      }
      let petsJSON = JSON.stringify(pets); //JSONify the pets data for rewrite
      fs.writeFile(petsPath, petsJSON, function(writeErr) {
        if (writeErr) { throw writeErr; }
        console.log(pet);
      });
    }
  }); // fs.readFile
} else { // if cmd is other than options available...
  console.error(databaseUsage);
  process.exit(1);
}
