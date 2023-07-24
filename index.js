const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const corsOptions = {
  origin: ['http://localhost:5000', 'http://example.com'],
};
console.log(process.env.USER_NAME)
const {
  MongoClient,
  ServerApiVersion,
  ObjectId
} = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.ytnqryr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const collageCollection = client.db('collage').collection('collageCollection')
    const userCollection = client.db('collage').collection('userCollection')
    const formCollection = client.db('collage').collection('formCollection')

    app.get('/card', async (req, res) => {

      const result = await collageCollection.find().limit(3).toArray()
      res.send(result)

    })
    app.get('/allCard', async (req, res) => {

      const result = await collageCollection.find().toArray()
      res.send(result)

    })
    app.get('/:id', async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id)
      }
      const result = await collageCollection.findOne(query)
      res.send(result)
    })
    app.get('/page/:id', async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id)
      }
      const result = await collageCollection.findOne(query)
      res.send(result)
    })

    app.get('/mycollege/:email', async (req, res) => {
      const email = req.params.email;
      console.log(email)
      const query1 = {
        email: email
      }
      const resultF = await formCollection.find(query1).toArray()
      console.log(resultF)
      const id = resultF[0].id
      console.log(id)
      const query2 = {
        _id: new ObjectId(id)
      }
      const result = await collageCollection.findOne(query2)
      console.log(result)
res.send(result)

    })

    app.get('/admissionFrom/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = {
        _id: new ObjectId(id)
      }
      const result = await collageCollection.findOne(query);
      res.send(result)
    })
    app.put('/setUser', async (req, res) => {
      const user = req.body;
      const email = req.body.email;
      const filter = {
        email: email
      }
      const existing = await userCollection.findOne(filter)
      if (existing) {
        res.send({
          massage: 'already exist'
        })
      }

      const options = {
        upsert: true
      };
      const updateDoc = {
        $set: {
          email: user.email,
          name: user.name,
          img: user.img
        }
      }

      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    })

    //todo
    app.post('/admissionForm', async (req, res) => {
      const body = req.body;
      const result = await formCollection.insertOne(body);
      res.send(result)

    })






    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();




    // Send a ping to confirm a successful connection
    await client.db("admin").command({
      ping: 1
    });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.use(cors(corsOptions));
app.get('/', (req, res) => {
  res.send('server is running')
})
app.listen(port, () => {
  console.log(`server is collage on port ${port}`)
})