const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// MongoDB
// crop-db   yi8mul1AZNsyrNME
const uri =
  "mongodb+srv://crop-db:yi8mul1AZNsyrNME@cluster0.fkciokq.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("crop-db");
    const cropsCollection = db.collection("crops");
    const usersCollection = db.collection("users");

    // ---------------- CROPS ----------------

    // Get
    app.get("/crops", async (req, res) => {
      const crops = await cropsCollection.find().toArray();
      res.send(crops);
    });

    // single crop
    app.get("/crops/:id", async (req, res) => {
      const { id } = req.params;
      const crop = await cropsCollection.findOne({ _id: new ObjectId(id) });
      res.send(crop);
    });

    // Add
    app.post("/crops", async (req, res) => {
      const newCrop = req.body;
      newCrop.interests = [];
      const result = await cropsCollection.insertOne(newCrop);
      res.send(result);
    });

    // update
    app.put("/crops/:id", async (req, res) => {
      const { id } = req.params;
      const updatedData = req.body;
      const result = await cropsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );
      res.send(result);
    });

    // delete
    app.delete("/crops/:id", async (req, res) => {
      const { id } = req.params;
      const result = await cropsCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // 1 add interss
    app.post("/crops/:id/interests", async (req, res) => {
      const { id } = req.params;
      const interest = req.body;
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

    //2 update
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

    // ----------------Profile ----------------

    // get user info
    app.get("/users/:email", async (req, res) => {
      const { email } = req.params;
      const user = await usersCollection.findOne({ email });
      res.send(user || {});
    });

    app.put("/users/:email", async (req, res) => {
      const { email } = req.params;
      const updatedInfo = req.body;
      try {
        const result = await usersCollection.updateOne(
          { email },
          { $set: updatedInfo },
          { upsert: true }
        );
        res.send({
          success: true,
          message: "Profile updated successfully",
          result,
        });
      } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Server error" });
      }
    });

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // client.close();
  }
}

run().catch(console.dir);




// endddd
app.get("/", (req, res) => {
  res.send("Server is running fine!");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


