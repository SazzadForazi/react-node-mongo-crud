const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = 5000;

//user : mydbuser1
//pass :Inf3YaClZdqwzpj5 


//middleware
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://mydbuser1:Inf3YaClZdqwzpj5@cluster0.qimng.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("foodMaster");
        const userCollection = database.collection("users");
        //GET API
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find({})
            const users = await cursor.toArray()
            res.send(users);
        });
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await userCollection.findOne(query)
            console.log('load user with id:', id);
            res.send(user)
        })
        //POST API
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            console.log('got new user', req.body)
            console.log('added user', result)
            res.json(result);
        });

        //DELETE API
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            console.log('deleting user with id', result);
            res.json(result)
        })
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Running my CURD Server');
});
app.listen(port, () => {
    console.log('listing port', port);
})