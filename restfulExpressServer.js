import express from 'express';
// import fs from 'fs/promises';
import pg from "pg"; //REQUIRED FOR DB ACCESSING

const server = express();
const port = 4000; //Server port
//DATABASE INSTANCE, RELIES ON PG IMPORT
const db = new pg.Pool({
    database: "petshop",
    port: 5432,//Postgres port
});
//looks for requests with header of content type = application/JSON
server.use(express.json());

// server.get('/pets', (req, res) => {
//     fs.readFile('pets.json', 'utf-8').then((data) => {
//         res.json(JSON.parse(data));
//     });
// });
server.get('/pets', (req, res) => {
    const id = Number(req.params.id);
    db.query("SELECT * FROM pets", []).then((result) => {
        res.send(result.rows);
    });
});
//FILE STORAGE
// server.get('/pets/:petIndex', (req, res) => {
//     const index = req.params.petIndex;
//     fs.readFile('pets.json', 'utf-8')
//       .then((string) => {
//         const pets = JSON.parse(string);
//         const pet = pets[index]
//         res.send(pet);
//       }) 
// })
server.get("/pets/:id", (req, res) => {
    const { id } = req.params;
    if (Number.isNaN(id)) {
        res.sendStatus(422);
        return;
    }
    db.query("SELECT * FROM pets WHERE id = $1", [id]).then ((result) => {
        if (result.rows.length === 0) {
            res.sendStatus(404);
        } else {
            res.send(result.rows[0]);
        }            
    });
});

// server.post('/pets', (req, res) => {
//     //get pet info from request body
//     const { age, name, kind } = req.body;
//     //create new pet
//     const pet = { age, name, kind };
//     //validation
//     if (!kind || !age || !name) {
//         res.sendStatus(422);
//         return;
//     }
//     fs.readFile("pets.json", "utf-8")
//       .then((data) => {
//         const pets = JSON.parse(data);
//         pets.push(pet);
//         fs.writeFile("pets.json", JSON.stringify(pets))
//       })
//       .then(() => {
//         res.status(201).send(pet);
//       })
// })
server.post("/pets", (req, res) => {
    const { name, kind } = req.body;
    const age = Number(req.body.age)
    //validation
    if (!kind || Number.isNaN(age) || !name) {
        res.sendStatus(422);
        return;
    }
    db.query(
        "INSERT INTO pets (name, age, kind) VALUES ($1, $2, $3) RETURNING *", 
        [name, age, kind]
        ).then((result) => {
            res.sendStatus(201).send(result.rows[0]);
        });
});

server.delete("/pets/:id", (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        res.sendStatus(422);
        return;
    }
    db.query(
        "DELETE FROM pets WHERE id = $1 RETURNING *", [id]).then((result) => {
            if (result.rows.length === 0) {
                res.sendStatus(404);
            } else {
                res.send(result.rows[0])
            }
        });
});


server.patch("/pets/:id", (req, res) => {
    const id = Number(req.params.id);
    const { name, kind } = req.body;
    const age = Number(req.body.age);
    db.query(`UPDATE pets
    set name = COALESCE($1, name), 
    age = COALESCE($2, age), 
    kind = COALESCE($3, kind) 
    WHERE id = $4 RETURNING *
    `, 
    [name, age, kind, id]
    ).then ((result) => {
        if (result.rows.length === 0) {
            res.sendStatus(404);
        } else {
            res.send(result.rows[0]);
        }
    })
    //get pet index and convert to number
    // const id = Number(req.params.id);
    // //get pet fields frim requeswt body
    // const { name, kind } = req.body;
    // const age = Number(req.body.age)
    // db.query("UPDATE pets SET name = COALESCE($1, name), age = COALESCE($2, age), kind = COALESCE($3, kind), WHERE id = $4 RETURNING *",
    //     [name, age, kind, id]).then((result) => { 
    //     res.send(result.rows[0]);
    //     console.log(result)
    // });
});

// server.patch("/pets/:petIndex", (req, res) => {
//     //get petIndex and convert to number
//     const petIndex = Number(req.params.petIndex);
//     //get pet fields from request body
//     const { age, name, kind } = req.body;
//     //validate given fields
//     const ageNum = Number(age);
//     if(
//         (!age || !name || !kind) || 
//         (age && Number.isNaN(ageNum)) ||
//         Number.isNaN(petIndex) ||
//         ageNum < 0
//         ) {
//         res.sendStatus(422);
//         return;
//     }
//     //read pets.json
//     fs.readFile("pets.json", "utf-8").then((data) => {
//     const pets = JSON.parse(data);
//     //validate pet index is in range
//     if (petIndex < 0 && petIndex >= pets.length) {
//         res.sendStatus(404);
//         return;
//     } 
//     //update the pet in question
//     const petToUpdate = pets[petIndex];
//     if (name !== undefined) {
//         petToUpdate.name = name;
//     }
//     if (age !== undefined) {
//         petToUpdate.age = ageNum;
//     }
//     if (kind !== undefined) {
//         petToUpdate.kind = kind;
//     }
//     //pets.splice
//     pets.splice(petIndex, 1, petToUpdate);
//     //write results back to pets.json
//     fs.writeFile("pets.json", JSON.stringify(pets));
//     //return response 200
//     res.send(petToUpdate);
//     res.status(201);
//     })
 
// })

server.listen(port, () => {
    console.log(`listening on port ${port}`);
});