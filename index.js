const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// mongoDB connection
const uri = "mongodb+srv://crop-db:yi8mul1AZNsyrNME@cluster0.fkciokq.mongodb.net/?appName=Cluster0";
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
    const db = client.db("crop-db");
    const cropsCollection = db.collection("crops");

    //  Read all crops
    app.get("/crops", async (req, res) => {
      const crops = await cropsCollection.find().toArray();
      res.send(crops);
    });

    //  Read single crop by ID
    app.get("/crops/:id", async (req, res) => {
      const { id } = req.params;
      const crop = await cropsCollection.findOne({ _id: new ObjectId(id) });
      res.send(crop);
    });

    

    console.log("MongoDB connected");
  } finally {
    // client.close(); 
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running 🌱");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


