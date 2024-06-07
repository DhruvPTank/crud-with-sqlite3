var fs = require('fs');
const fsPromise = require('fs/promises');
const sqlite3 = require('sqlite3').verbose();
const sql3 = require('sqlite3');
const sql = require('sqlite');
const bodyParser = require('body-parser');
const getusers = require('./users');


app.use(bodyParser.json());


let database = new sqlite3.Database('notes.db');

database.serialize(() => {
    database.run('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, task TEXT, desc TEXT)');

    // const mytasks = database.prepare("INSERT INTO tasks VALUES (1, 'my 1st task', 'first task description')");

    // mytasks.run();

    // mytasks.finalize();
});
getusers();

async function getDBConnection() {
    const db = await sql.open({
        filename: "notes.db",
        driver: sql3.Database
    });
    return db;
}
//Database declaration ends here





//get the task list by it from the api with post man
app.get('/tasks', async (req, res) => {
    // TODO: send task not front array but reading from file

    //GET ALL TASK FROM DATABASE SATRTS HERE
    //GET ALL TASK FROM DATABASE ENDS HERE

    let db = await getDBConnection();
    let mytasks = await db.all("SELECT * from tasks");
    await db.close();
    console.log(mytasks);
    return res.json(mytasks)
    // return res.json(mytasks);

});

//TODO: find the place to put middle ware written below
// sequence is important on where middleware is placed
//add the task by it from post man


app.post('/add', (req, res) => {
    const { task, desc } = req.body;
    if (!task || !desc) {
        return res.send('Missing task or desc'); c
    }
    //     const newTask = { id: arr.length + 1, task, desc }
    const newTask = { task, desc }

    //     file = 'data.json';


    //INSERTING THE DATA INTO DATABASE STARTS HERE
    const insertTask = database.prepare("INSERT INTO tasks (id, task ,desc) VALUES (NULL, ?, ?)", [newTask.task, newTask.desc]);
    console.log(insertTask);
    insertTask.run();
    insertTask.finalize();

    res.send(newTask);
    //INSERTING THE DATA INTO DATABASE ENDS HERE

})

//update the tsk by it with the specific id
//also changing the file data.json with the updated data
app.put('/update/:id', async (req, res) => {
    //establing the connection with the database

    let db = await getDBConnection();
    let mytask = await db.all("SELECT id from tasks where id = ?", [req.params.id]);
    await db.close();

    if (!mytask) {
        res.send(404).send('task not found');
    }
    const { task, desc } = req.body;

    mytask.task = task || mytask.task;

    //check for task value is added or not asn same for desc
    mytask.desc = desc || mytask.desc;
    const updateTask = database.prepare(`UPDATE tasks SET task = ?, desc = ? WHERE id = ?`, [task, desc, req.params.id]);

    // console.log(updateTask);
    updateTask.run();
    updateTask.finalize();

    const mtask = database.prepare("SELECT * FROM tasks WHERE id = ?", [req.params.id]);
    mtask.run();
    mtask.finalize();
    res.send(mtask);
    console.log(mtask);

    // fsPromise.writeFile('data.json', JSON.stringify(arr));
})
app.delete('/delete/:id', (req, res) => {
    //DELETE THE DATA FROM DATABASE STARTS HERE
    try {
        const id = req.params.id;
        const task = database.prepare("SELECT * FROM tasks ");
        console.log(task);
        task.run();
        task.finalize();
        console.log(JSON.parse(JSON.stringify(task)));
        res.json(task);

    } catch (error) {
        res.send(error);
        console.log(error);
        console.log("error found");
    }


    //DELETE THE DATA FROM DATABASE ENDS HERE
})



