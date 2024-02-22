const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ac-dczafpo-shard-00-00.ylujpzf.mongodb.net:27017,ac-dczafpo-shard-00-01.ylujpzf.mongodb.net:27017,ac-dczafpo-shard-00-02.ylujpzf.mongodb.net:27017/?ssl=true&replicaSet=atlas-ul1323-shard-0&authSource=admin&retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // await client.connect();

        const jobCollection = client.db("jobWorldDB").collection('addJob');

        app.post('/addJob', async(req, res) =>{
            try{
                const addJob = req.body;
                console.log(addJob);
                const result = await jobCollection.insertOne(addJob);
                res.send(result)
            }catch(error){
                console.log(error)
            }
        })

        app.get('/addJob', async(req, res) =>{
            console.log(req.query.email)

            let query = {};
            if(req.query?.email){
                query = {email: req.query.email}
            }

            const result = await jobCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/addJob/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await jobCollection.findOne(query);
            res.send(result);
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) =>{
    res.send('JOB WORLD SERVER RUNNING ON PORT')
})

app.listen(port, () =>{
    console.log(`Job World server running on ${port}`)
})