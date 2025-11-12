const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId} = require("mongodb");




const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// mongoDB connection
const uri = "mongodb+srv://crop-db:yi8mul1AZNsyrNME@cluster0.fkciokq.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri);


async function run() {
  try {
    await client.connect();
    const db = client.db("crop-db");
    const cropsCollection = db.collection("crops");

    //  read all crops
    app.get("/crops", async (req, res) => {
      const crops = await cropsCollection.find().toArray();
      res.send(crops);
    });

    app.get("/crops/:id", async (req, res) => {
      const { id } = req.params;
      const crop = await cropsCollection.findOne({ _id: new ObjectId(id) });
      res.send(crop);
    });
    //get-crops
    app.get("/crops", async (req, res) => {
      const crops = await cropsCollection.find().toArray();
      res.send(crops);
    });
    // get single c
    app.get("/crops/:id", async (req, res) => {
      const { id } = req.params;
      const crop = await cropsCollection.findOne({ _id: new ObjectId(id) });
      res.send(crop);
    });

    // POST
    // submit interest
    app.post("/crops/:id/interests", async (req, res) => {
      const { id } = req.params;
      const interest = req.body;

      // mongodb unique _id
      const interestId = new ObjectId();
      const newInterest = { _id: interestId, ...interest };

      const result = await cropsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $push: { interests: newInterest } }
      );

      res.send({
        success: result.modifiedCount > 0,
        message:
          result.modifiedCount > 0
            ? "Interest submitted successfully"
            : "Failed to submit interest",
        interestId: interestId.toString(),
      });
    });

    // POST  Add Crop
    app.post("/crops", async (req, res) => {
      const newCrop = req.body;
      newCrop.interests = [];
      const result = await cropsCollection.insertOne(newCrop);
      res.send(result);
    });

    //4 submit interest
    app.post("/crops/:id/interests", async (req, res) => {
      const { id } = req.params;
      const interest = req.body;
      const interestId = new ObjectId();
      const newInterest = { _id: interestId, ...interest };

      await cropsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $push: { interests: newInterest } }
      );

      res.send({ success: true, interestId: interestId.toString() });
    });



    // POST End

    // update crop
    app.put("/crops/:id", async (req, res) => {
      const { id } = req.params;
      const updatedData = req.body;
      const result = await cropsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );
      res.send(result);
    });

    // update iInterest
    app.patch("/crops/:cropId/interests/:interestId", async (req, res) => {
      const { cropId, interestId } = req.params;
      const { status } = req.body;

      const result = await cropsCollection.updateOne(
        {
          _id: new ObjectId(cropId),
          "interests._id": new ObjectId(interestId),
        },
        { $set: { "interests.$.status": status } }
      );

      res.send(
        result.modifiedCount > 0
          ? { success: true, message: "Interest status updated" }
          : { success: false, message: "Failed to update status" }
      );
    });

    // Add new cro

    app.post("/crops", async (req, res) => {
      const newCrop = req.body;
      newCrop.interests = [];
      const result = await cropsCollection.insertOne(newCrop);
      res.send(result);
    });

    // delete crop
    app.delete("/crops/:id", async (req, res) => {
      const { id } = req.params;
      const result = await cropsCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    //
    console.log("MongoDB connected");
  } finally {
    // client.close(); 
  }
}

run().catch(console.dir);
// 5
app.get("/", (req, res) => {
  res.send("Server is running fine!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


