const express = require('express')
const path = require('path')
const app = express()
const {v4} = require('uuid')
app.use(express.static( path.resolve(__dirname, 'client') ))

const data = require('./data/data')
const todos = data.todos.map(todo => {
    return {...todo, id: v4(), done: false}
})

app.use(express.json())

app.get('/api/todos', (req, res) => {
    res.json(todos)
})

app.post('/api/todos', (req, res) => {
    const text = req.body.text;
    if(text) {
        const todo = {text, id: v4(), done: false}
        todos.push(todo)
        res.status(201).json(todo)
    }
    else {
        res.status(400).json()
    }
})

app.put('/api/todos/:id', (req, res) => {
    const index = todos.findIndex(t => t.id === req.params.id)
    todos[index] = req.body
    res.json(todos[index])
})

app.delete('/api/todos/:id', (req, res) => {
    const index = todos.findIndex(t => t.id === req.params.id)
    if(index !== -1) {
        todos.splice(index, 1)
    }
    res.json()
})

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})


app.listen(3000)