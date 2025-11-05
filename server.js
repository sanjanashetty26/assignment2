const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
app.use(express.json());

// MongoDB connection string
const uri = "mongodb+srv://sanjana:sanj1234@cluster0.6mr25.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
}
connectDB();

// Database and Collections
const db = client.db("synergia");
const eventsCollection = db.collection("events");
const bookingsCollection = db.collection("bookings");

/* -------------------------------------------------------------------
   EVENT ROUTES
------------------------------------------------------------------- */

// 1️⃣ GET /events - Get all events
app.get("/events", async (req, res) => {
  try {
    const events = await eventsCollection.find({}).toArray();
    res.json(events);
  } catch (error) {
    res.status(500).send("❌ Failed to fetch events");
  }
});

// 2️⃣ POST /events/add - Add a new event
app.post("/events/add", async (req, res) => {
  try {
    const newEvent = req.body;
    await eventsCollection.insertOne(newEvent);
    res.send("✅ Event added successfully");
  } catch (error) {
    res.status(500).send("❌ Failed to add event");
  }
});

// 3️⃣ GET /event/:id - Get event by ID
app.get("/event/:id", async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send("❌ Invalid Event ID format");
  }

  try {
    const event = await eventsCollection.findOne({ _id: new ObjectId(id) });
    if (event) res.json(event);
    else res.status(404).send("⚠️ Event not found");
  } catch (error) {
    res.status(500).send("❌ Error fetching event");
  }
});

// 4️⃣ PUT /event/:id - Update event details
app.put("/event/:id", async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send("❌ Invalid Event ID format");
  }

  try {
    await eventsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );
    res.send("✅ Event updated successfully");
  } catch (error) {
    res.status(500).send("❌ Failed to update event");
  }
});

// 5️⃣ DELETE /event/:id - Delete event
app.delete("/event/:id", async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send("❌ Invalid Event ID format");
  }

  try {
    await eventsCollection.deleteOne({ _id: new ObjectId(id) });
    res.send("✅ Event deleted successfully");
  } catch (error) {
    res.status(500).send("❌ Failed to delete event");
  }
});

/* -------------------------------------------------------------------
   BOOKING ROUTES
------------------------------------------------------------------- */

// 1️⃣ GET /api/bookings - Get all bookings
app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await bookingsCollection.find({}).toArray();
    res.json(bookings);
  } catch (error) {
    res.status(500).send("❌ Failed to fetch bookings");
  }
});

// 2️⃣ POST /api/bookings - Create new booking
app.post("/api/bookings", async (req, res) => {
  try {
    const booking = req.body;
    await bookingsCollection.insertOne(booking);
    res.send("✅ Booking created successfully");
  } catch (error) {
    res.status(500).send("❌ Failed to create booking");
  }
});

// 3️⃣ GET /api/bookings/:id - Get booking by ID
app.get("/api/bookings/:id", async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send("❌ Invalid Booking ID format");
  }

  try {
    const booking = await bookingsCollection.findOne({ _id: new ObjectId(id) });
    if (booking) res.json(booking);
    else res.status(404).send("⚠️ Booking not found");
  } catch (error) {
    res.status(500).send("❌ Error fetching booking");
  }
});

// 4️⃣ PUT /api/bookings/:id - Update participant details
app.put("/api/bookings/:id", async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send("❌ Invalid Booking ID format");
  }

  try {
    await bookingsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );
    res.send("✅ Booking updated successfully");
  } catch (error) {
    res.status(500).send("❌ Failed to update booking");
  }
});

// 5️⃣ DELETE /api/bookings/:id - Cancel booking
app.delete("/api/bookings/:id", async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send("❌ Invalid Booking ID format");
  }

  try {
    await bookingsCollection.deleteOne({ _id: new ObjectId(id) });
    res.send("✅ Booking deleted successfully");
  } catch (error) {
    res.status(500).send("❌ Failed to delete booking");
  }
});

/* -------------------------------------------------------------------
   SERVER START
------------------------------------------------------------------- */
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});

