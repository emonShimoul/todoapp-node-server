const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pabg0.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        console.log('database connected successfully!!');
        const database = client.db('todoapp');
        const todoInfoCollection = database.collection('todoinfo');

        // POST API
        app.post('/todoInfo', async (req, res) => {
            const todoInfo = req.body;
            const result = await todoInfoCollection.insertOne(todoInfo);
            res.json(result);
        })

        // GET API
        app.get('/todoInfo', async (req, res) => {
            const cursor = todoInfoCollection.find();
            const todoInfo = await cursor.toArray();
            res.json(todoInfo);
        })

        // UPDATE API
        app.put('/todoInfo', async (req, res) => {
            const updatedProduct = req.body;
            const { state, id } = updatedProduct;

            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    state: state,
                },
            };
            const result = await todoInfoCollection.updateOne(filter, updateDoc);
            res.json(result);
        })

        // DELETE API
        app.delete('/todoInfo', async (req, res) => {
            const deletedProduct = req.body;
            const { _id } = deletedProduct;
            // console.log(_id);

            const query = { _id: ObjectId(_id) };
            const result = await todoInfoCollection.deleteOne(query);
            // console.log("deleted successfully ", result);
            res.json(result);
        })
    }
    finally {
        // await client.close(); 
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {

    res.send('Hello TODO APP!!')

});

app.listen(port, () => {
    console.log(`listening at ${port}`)
});