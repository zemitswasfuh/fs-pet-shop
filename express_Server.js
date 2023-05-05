import express from "express";
import fs from 'fs';

const app = express();
const port = 8000;

app.get('/', (req, res) => {
    res.send('hello world')
  });

app.get('/pets', (req, res) => {
    fs.readFile('pets.json', 'utf-8', (error,  string) => {
        const pets = JSON.parse(string);
        res.setHeader('Content-Type', 'application/json');
        res.send(pets);
    });
});

app.get('/pets/:petIndex', (req, res) => {
    const index = req.params.petIndex;
    fs.readFile('pets.json', 'utf-8', (error,  string) => {
        const pets = JSON.parse(string);
        const pet = pets[index]
        res.send(pet);
    });
});

app.listen(port, () => {
    console.log(`express app listening on port ${port}`)
});