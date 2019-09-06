const express = require("express");
const mongodb = require("mongodb");
const bodyparser = require('body-parser');
const ejs = require('ejs');

const app = express();
const mongoClient = mongodb.MongoClient;
const mongoUrl = 'mongodb://localhost:27017/';
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(bodyparser.json());

let db;

mongoClient.connect(mongoUrl, {useUnifiedTopology: true, useNewUrlParser: true}, (error, client) => {
    if(error) {
        console.log(error);
    }
    else {
        console.log("Connected to MongoDB");
        db = client.db('fit2095Week5Lab');
    }
});

app.get('/', (request, response) => {
    response.render('home.html');
});

app.get('/addtask', (request, response) => {
    response.sendFile(__dirname + '/views/addtask.html');
});

app.get('/viewtasks', (request, response) => {
    db.collection('tasks').find({}).toArray((error, data) => {
        response.render('viewtasks.html', {data: data});
    });
});

app.get('/deleteTask/:id', (request, response) => {
    db.collection('tasks').deleteOne({_id: new mongodb.ObjectID(request.params.id)});
    response.send('done');
});

app.get('/changeStatus/:id/:status', (request, response) => {
    db.collection('tasks').updateOne(
        {_id: new mongodb.ObjectID(request.params.id)},
        {$set: {status: request.params.status}}
    )
    console.log(request.params.id);
    console.log(request.params.status);
    response.send('done');
});

app.get('/deleteCompleted', (request, response) => {
    db.collection('tasks').deleteMany({status: "Complete"});
    response.send('done');
});



app.post('/addtask', (request, response) => {
    db.collection('tasks').insertOne({
        name: request.body.taskName,
        assignTo: request.body.assignTo,
        date: new Date(request.body.taskDate),
        status: request.body.taskStatus,
        description: request.body.taskDescription
    });

    response.send("done");
});


app.listen(8000, () => { console.log("Server running..."); });
