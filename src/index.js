const express = require('express');
const app = express();

//for get json parameter, use the line below
app.use(express.json())

// query params: we use like: /courses?page=1&order=asc
app.get("/courses", (request, response) => {
  const query = request.query;

  console.log(query)
  return response.json([
    "Curso 1",
    "Curso 2",
    "Curso 3"
  ])
})


// body params: we use when we want send a json on body
app.post("/courses", (request, response) => {
  const body = request.body
  console.log(body)

  return response.json([
    "Curso 1",
    "Curso 2",
    "Curso 3",
    "Curso 4"
  ])
})

// request params: we use when we need send a ID or something like that on url.
app.put("/courses/:id", (request, response) => {
  const {id} = request.params;

  console.log(id)
  return response.json({id: id})
})

app.patch("/courses/:id", (request, response) => {
  return response.json([
    "Curso 5",
    "Curso 6",
    "Curso 3",
    "Curso 4"
  ])
})

app.delete("/courses/:id", (request, response) => {
  return response.json([
    "Curso 5",
    "Curso 6",
    "Curso 3"
  ])
})

app.listen(3333)

