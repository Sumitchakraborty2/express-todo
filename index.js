const fs = require('fs');
const express = require('express');
const app = express();
const port = 8080;

app.use(express.json());

function read(){
    const data = fs.readFileSync('todos.json','utf-8');
    return JSON.parse(data);
}

function write(todo){
    fs.writeFileSync('todos.json', JSON.stringify(todo, null, 2), 'utf-8');
}

app.get('/', (req,res) => {
    res.json(read());   
})

app.post('/', (req,res) => {
    const taskName = req.body.todo;
    const todo = read();
    todo.push({
        task:taskName,
        status:"pending"
    })
    write(todo);
    
    res.json({msg:"done"});
})

app.put('/:id', (req,res) => {
    const index = (req.params.id) ;
    const todos = read();

    if(todos.length === 0){
        res.status(400).json({msg: "There is no todos"});
    }
    else if(todos.length < index ){
        res.status(404).json({msg:"The server cannot find the requested resource"});
    }
    
    if(todos[index-1].status === "pending"){
        todos[index-1].status = "completed";
    } else{
        todos[index - 1].status = "pending";
    } 
    write(todos);
    res.json({msg:"successfully updated"});

})

app.delete('/:id', (req,res) => {
    const index = (req.params.id) ;
    const todos = read();

    if(todos.length === 0){
        res.status(400).json({msg: "There is no todos"});
    }
    else if(todos.length < index ){
        res.status(404).json({msg:"The server cannot find the requested resource"});
    }
    
    todos.splice(index-1,1);
    write(todos);
    res.json({msg:"successfully deleted"});

})

app.listen(port, () => {
    console.log(`listen of port ${port}`);
})