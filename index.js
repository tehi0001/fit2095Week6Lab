const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require('body-parser');
const ejs = require('ejs');

const Task = require('./models/task');
const Developer = require('./models/developer');

const app = express();
const mongoUrl = 'mongodb://localhost:27017/Week6';

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(bodyparser.json());

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if(err) {
        console.error(err);
        throw err;
    }

    console.log("DB Connected");

});



app.get('/', (request, response) => {
    response.render('home.html');
});

app.get('/addtask', (request, response) => {
    Developer.find({}, (err, data) => {
        if(err) {
            response.status(500).send(err);
            throw err;
        }

        response.render('addtask.html', {devs: data});
    })
    response.sendFile(__dirname + '/views/addtask.html');
});

app.get('/add-dev', (request, response) => {
    response.sendFile(__dirname + '/views/add_dev.html');
});

app.get('/viewtasks', (request, response) => {
    Task.find({}, (err, data) => {
        if(err) {
            response.status(500).send(err);
            throw err;
        }

        response.render('viewtasks.html', {data: data});
    });
});

app.get('/viewdevs', (request, response) => {
    Developer.find({}, (err, data) => {
        if(err) {
            response.status(500).send(err);
            throw err;
        }

        response.render('viewdevs.html', {data: data});
    });
});

app.get('/deleteTask/:id', (request, response) => {
    Task.findByIdAndRemove(request.params.id, (err) => {
        if(err) {
            throw err;
        }

        response.send("reloadTasksList");
    })
    
});

app.get('/changeStatus/:id/:status', (request, response) => {

    Task.updateOne({_id: request.params.id}, {status: request.params.status}, (err) => {
        if(err) {
            throw err;
        }

        response.send('reloadTasksList');
    })
    
});

app.get('/deleteCompleted', (request, response) => {
    Task.deleteMany({status: "Complete"}, (err) => {
        if(err) {
            response.status(500).send(err);
            throw err;
        }

        response.send("reloadTasksList");

    });
});



app.post('/addtask', async(request, response) => {
    try {
        let task = new Task({
            name: request.body.taskName,
            assignTo: new mongoose.Types.ObjectId(request.body.assignTo),
            dueDate: new Date(request.body.taskDate),
            status: request.body.taskStatus,
            description: request.body.taskDescription
        });

        task.save();

        response.send("done");
    }

    catch(err) {
        response.status(500).send(err);
    }
});

app.post("/add-dev", (request, response) => {
    try {
        let dev = new Developer(request.body);
        dev.save();
        response.send("done");
    }
    catch(err) {
        response.status(500).send(err);
    }
})


app.listen(8000, () => { console.log("Server running..."); });
