import process from "node:process";
import fs from "node:fs";

const subcommand = process.argv[2];
//node pets.js read
if (subcommand === "read") {
  const petIndex = process.argv[3];
  fs.readFile("pets.json", "utf8", (error, string) => {
    if (error) {
      throw error;
    }
    const pets = JSON.parse(string);
    if (petIndex === undefined) {
      console.log(pets);
    } else {
      console.log(pets[petIndex]);
    }
  });
} else if (subcommand === "create") {
  // Do create stuff
    const age = parseInt(process.argv[3]);
    const kind = process.argv[4];
    const name = process.argv[5];
    if (!age | !kind | !name) {
        console.error('Usage: node pets.js create AGE KIND NAME')
    }
    fs.readFile('pets.json', 'utf8', (error, string) => {
        if (error) {
            throw error;
        }
        const pets = JSON.parse(string);
        const newPet = {age, kind, name}; //this is your question: does the object 
        pets.push(newPet); //create it's own keys and values based on the way we wrote the code? it is shorthand for {age: age etc}
        fs.writeFile('pets.json', JSON.stringify(pets), (error) => {
            if (error) {
                throw error;
            }
            console.log(newPet);
        })
    });

} else {
  console.error("Usage: node pets.js [read | create | update | destroy]");
  process.exit(1);
}