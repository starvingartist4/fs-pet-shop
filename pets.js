'use strict';

let fs = require('fs');
let path = require('path');
let petsPath = path.join(__dirname, 'pets.json');

let node = path.basename(process.argv[0]);
let file = path.basename(process.argv[1]);
let cmd = process.argv[2];
let option1 = process.argv[3];
let option2 = process.argv[4];
let option3 = process.argv[5];
let option4 = process.argv[6];

if (cmd === 'read') {
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }
    let idx = option1;
    //let idx = process.argv(3);
    let pets = JSON.parse(data);
    let pet = JSON.parse(data)[idx];

    if (idx>pets.length-1 || idx<0) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
      process.exit(1);
    } else if (!idx) {
      console.log(pets);
    } else {
      console.log(pet);
    }
  });
}
else if (cmd === 'create') {
  fs.readFile(petsPath, 'utf8', function(readErr, data) {
    if (readErr) {
      throw readErr;
    }

    let optAge = option1;
    let optKind = option2;
    let optName = option3;

    let pets = JSON.parse(data);
    let pet = { age: parseInt(optAge), kind: `${optKind}`, name: `${optName}` };

    if (!optAge || !optKind || !optName) {
      console.error(`Usage: ${node} ${file} ${cmd} AGE KIND NAME`);
      process.exit(1);
    }

    pets.push(pet);

    let petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
      console.log(pet);
    });
  });
}
else if (cmd === 'update') {
  fs.readFile(petsPath, 'utf8', function(readErr, data) {
    if (readErr) {
      throw readErr;
    }

    let optIdx = option1;
    let optAge = option2;
    let optKind = option3;
    let optName = option4;

    let pets = JSON.parse(data);
    let pet = { age: parseInt(optAge), kind: `${optKind}`, name: `${optName}` };

    if (!optIdx || !optAge || !optKind || !optName) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX AGE KIND NAME`);
      process.exit(1);
    }

    pets[optIdx] = pet;

    let petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
      console.log(pet);
    })

  });
}
else if (cmd === 'destroy') {
  fs.readFile(petsPath, 'utf8', function(readErr, data) {
    if (readErr) {
      throw readErr;
    }

    let optIdx = option1;

    let pets = JSON.parse(data);

    if (!optIdx) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
      process.exit(1);
    }

    let unwanted_pet = pets.splice(optIdx, 1);

    let petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
      console.log(unwanted_pet);
    });
  });
}
else {
  console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
  process.exit(1);
}
