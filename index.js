const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port =process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

 

const uri = `mongodb+srv://${process.env.PREC_USER}:${process.env.PREC_PASS}@trmcamp0.7libfgs.mongodb.net/?retryWrites=true&w=majority&appName=trmcamp0`;



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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const usersCollection = client.db('usersDB').collection('users');



    //http://localhost:5000/users?searchParams =text
    app.get('/users',async(req, res)=>{
      const {searchParams} = req.query;
      console.log(searchParams)

      // const query = {}
      // if(searchParams){
      //   query = {name: {$regex: searchParams, $options:"i"}};
      // }

      const result = await  usersCollection.find().toArray();
      res.send(result)
    })
    app.get('/users/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await usersCollection.findOne(query)
      res.send(result)
    })

    app.post('/users',async(req,res)=>{
      const newUser = req.body;
      const result =await usersCollection.insertOne(newUser);
      res.send(result)

    })
    app.put('/users/:id',async(req,res)=>{
      const id = req.params.id;
      console.log(id) 
      const query = {_id: new ObjectId(id)};
      
      console.log(query)
        const options = { upsert: true };
      const updatedusers = req.body;
      const updetedDoc ={
        $set:updatedusers
      }
      const result = await usersCollection.updateOne(query,updetedDoc,options)
      res.send(result)
      console.log(result)
    })

    app.delete('/users/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await usersCollection.deleteOne(query)
      res.send(result)
      
    })










    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Prectic is getting  heting')
})

app.listen(port, () => {
  console.log(`Prectic server  is running port ${port}`)
})


 