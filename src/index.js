const express = require('express')
const {v4: uuidV4} = require("uuid")

const app = express();
app.use(express.json())

const customers = []

function verifyIfExistsAccountCPF(request, response, next){
  const {cpf} = request.headers;
  const customer = customers.find((customer) => customer.cpf === cpf)
   
  if(!customer){
    return response.status(400).json({message: "Customer not found!"})
  }
  
  request.customer = customer;

  return next();
}

function getBalance(statement){
  const balance =  statement.reduce((acc, operation) => {
    if(operation.type === 'credit'){
      return acc + operation.amount;
    }else {
      return acc - operation.amount;
    }

  }, 0)

  return balance;
}

app.post("/account", (request, response) => {
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

// everything below this line, have a middleware
//app.use(verifyIfExistsAccountCPF)

app.get("/account", verifyIfExistsAccountCPF, (request, response) => {
    const {cpf} = request.headers
    const {customer} = request;

    const account = customers.find((customer) => customer.cpf === cpf)

    return response.json({account})
})

app.get("/statement", verifyIfExistsAccountCPF, (request, response) => {
 const {customer} = request;

  if(customer.statement.length === 0 ){
    return response.json({message: "No one statement was found!"})
  }

  return response.json(customer.statement)
})

app.post("/deposit", verifyIfExistsAccountCPF, (request, response) => {
  const {description, amount} = request.body;
  const {customer} = request;

  const statementOperation = {
    description, 
    amount, 
    createAt: new Date(),
    type: "credit"
  }

  customer.statement.push(statementOperation)

  return response.status(201).send(customer.statement)
})

app.post("/withdraw", verifyIfExistsAccountCPF, (request, response) => {
  const {amount} = request.body;
  const {customer} = request;

  const balance = getBalance(customer.statement)

  if(balance < amount) {
    return response.status(400).json({error: "Insufficient funds!"})
  }

  const statementOperation ={
    amount, 
    createAt: new Date(),
    type: "debit",
  }

  customer.statement.push(statementOperation)

  return response.status(201).send(customer.statement)

})

app.get("/statement/date", verifyIfExistsAccountCPF, (request, response) => {
  const {customer} = request;
  const {date} = request.query;

  const dateFormat  = new Date(date + " 00:00")

  const statement = customer.statement.filter(
    (statement) => statement.createAt.toDateString() === new Date(dateFormat).toDateString()
    )

   if(customer.statement.length === 0 ){
     return response.json({message: "No one statement was found!"})
   }
 
   return response.json(statement)
 })

 app.put("/account", verifyIfExistsAccountCPF, (request, response) => {
  const {name} = request.body;
  const {customer} = request

  customer.name = name;

  return response.status(201).json(customer.name)
 })

 app.delete("/account", verifyIfExistsAccountCPF, (request, response) => {
  const {customer} = request;

  //splice
  customers.splice(customer, 1)

  return response.status(200).json(customers)
 })

 app.get("/balance", verifyIfExistsAccountCPF, (request, response) => {
  const {customer} = request;

   const balance = getBalance(customer.statement)

   return response.json(balance)
 })

app.listen(3333)
