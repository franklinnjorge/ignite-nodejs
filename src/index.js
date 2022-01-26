const { json } = require('body-parser');
const express = require('express')
const {v4: uuidV4} = require("uuid")

const app = express();
app.use(express.json())
app.listen(3333)

const customers = []


app.post("/customers", (request, response) => {
  const {name, cpf} = request.body;

  const customerAlreadyExist = customers.some(
    (customer) => customer.cpf === cpf)

  if(customerAlreadyExist){
    return response.status(400).json({error: "Customer Already Exist!"});
  }

  customers.push({
    name, 
    cpf, 
    id: uuidV4(),
    statement: []
  })

  return response.status(201).send(customers)
})

app.get("/statement", (request, response) => {
  const {cpf} = request.headers;

  const customer = customers.find((customer) => customer.cpf === cpf)

  if(!customer){
    return response.status(400).json({message: "Customer not found!"})
  }

  if(customer.statement.length === 0 ){
    return response.json({message: "No one statement was found!"})
  }

  return response.json(customer.statement)
})

