const express = require("express");

const server = express();
//Route params =  /users/1
//Request body = {'name': 'janderson'}
server.use(express.json());

///CRUD - Create, Read, Update e Delete

const users = ["Diego", "Cláudio", "Victor"];

server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url}`);
  next();

  console.timeEnd("Request");
});

function checkUserExist(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ erro: "User name is required" });
  }

  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ erro: "User doen't exist" });
  }
  req.user = user;
  return next();
}

//https:localhost:3000/users
server.get("/users", (req, res) => {
  return res.json(users);
});

//https:localhost:3000/users/1
server.get("/users/:index", checkUserInArray, (req, res) => {
  return res.json(req.user);
});

//CREATE
server.post("/users", checkUserExist, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

//UPDATE
server.put("/users/:index", checkUserInArray, checkUserExist, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;
});

//DELETE
server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;
  users.splice(index, 1);
  return res.send();
});

server.listen(3000);
