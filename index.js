const express = require("express");
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = 3000;

app.use(cors())
app.use(express.json())

// MongoDB
// model-db   mKsvySoRkFPAfOzT
const uri =
  "mongodb+srv://model-db:mKsvySoRkFPAfOzT@cluster0.fkciokq.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    // API MongoDB  Data anbo and pathabo

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
// End MongoDB


app.get("/", (req, res) => {
  res.send("sarver is running");
});


app.listen(port, () => {
  console.log(`sarver is listening on port ${port}`);
});
