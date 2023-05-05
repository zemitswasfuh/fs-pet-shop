import express from 'express';
import fs from 'fs/promises';

const server = express();
const port = 4000;
//looks for requests with header of content type = application/JSON
server.use(express.json());

server.get('/pets', (req, res) => {
    fs.readFile('pets.json', 'utf-8').then((data) => {
        res.json(JSON.parse(data));
    });
});

server.get('/pets/:petIndex', (req, res) => {
    const index = req.params.petIndex;
    fs.readFile('pets.json', 'utf-8')
      .then((string) => {
        const pets = JSON.parse(string);
        const pet = pets[index]
        res.send(pet);
      })
})

server.post('/pets', (req, res) => {
    //get pet info from request body
    const { age, name, kind } = req.body;
    //create new pet
    const pet = { age, name, kind };
    //validation
    if (!kind || !age || !name) {
        res.sendStatus(422);
        return;
    }
    fs.readFile("pets.json", "utf-8")
      .then((data) => {
        const pets = JSON.parse(data);
        pets.push(pet);
        fs.writeFile("pets.json", JSON.stringify(pets))
      })
      .then(() => {
        res.status(201).send(pet);
      })
})

server.patch("/pets/:petIndex", (req, res) => {
    //get petIndex and convert to number
    const petIndex = Number(req.params.petIndex);
    //get pet fields from request body
    const { age, name, kind } = req.body;
    //validate given fields
    const ageNum = Number(age);
    if(
        (!age || !name || !kind) || 
        (age && Number.isNaN(ageNum)) ||
        Number.isNaN(petIndex) ||
        ageNum < 0
        ) {
        res.sendStatus(422);
        return;
    }
    //read pets.json
    fs.readFile("pets.json", "utf-8").then((data) => {
    const pets = JSON.parse(data);
    //validate pet index is in range
    if (petIndex < 0 && petIndex >= pets.length) {
        res.sendStatus(404);
        return;
    } 
    //update the pet in question
    const petToUpdate = pets[petIndex];
    if (name !== undefined) {
        petToUpdate.name = name;
    }
    if (age !== undefined) {
        petToUpdate.age = ageNum;
    }
    if (kind !== undefined) {
        petToUpdate.kind = kind;
    }
    //pets.splice
    pets.splice(petIndex, 1, petToUpdate);
    //write results back to pets.json
    fs.writeFile("pets.json", JSON.stringify(pets));
    //return response 200
    res.send(petToUpdate);
    res.status(201);
    })
 
})

server.listen(port, () => {
    console.log(`listening on port ${port}`);
});