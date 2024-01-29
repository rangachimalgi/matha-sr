// api.js
import express from "express";
import DataModel from "../models/DataModel.js";

const router = express.Router();

// Route to add data
router.post('/addData', async (req, res) => {
  try {
    const { name, phone, seva, notify } = req.body;

    // Create a new instance of the DataModel with the provided data
    const newData = new DataModel({
      name,
      phone,
      seva,
      notify,
    });

    // Save the data to the MongoDB collection
    const savedData = await newData.save();

    console.log('Data added to MongoDB:', savedData); // Log message

    res.status(201).json(savedData);
  } catch (error) {
    console.error('Error adding data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to fetch data
router.get('/fetchData', async (req, res) => {
  try {
    const data = await DataModel.find();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Other routes for retrieving, updating, or deleting data could be added here

export default router;
