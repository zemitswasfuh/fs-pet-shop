import http from "node:http";
import fs from "node:fs";

http.createServer(function (request, response) {
const petRegExp = /^\/pets\/(\d+)$/;

if (request.method === "GET" && request.url === "/pets") {
    fs.readFile("pets.json", "utf-8", (error, string) => {
    // response.setHeader("Content-Type", "application/json");
    console.log(string)
    response.end(string);
    });
} else if (request.method === "GET" && petRegExp.test(request.url)) {
    //get petIndex
    console.log(request.url.match(petRegExp));
    const petIndex = Number(request.url.match(petRegExp)[1]);
    //read pets.json
    fs.readFile("pets.json", "utf-8", (error, string) => {
    //handle out-of-bounds indexes
    response.setHeader("Content-Type", "application/json");
    const pets = JSON.parse(string);
    const pet = pets[petIndex];
    const petString = JSON.stringify(pet);
    response.end(petString);
    });
} else {
    response.end("Goodbye!");
}
}).listen(8000, function () {
console.log("Listening of port 8000");
});