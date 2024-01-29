import express from "express";
import Order from "../models/Orders.js";
import multer from "multer";
import { uploadReport, downloadReports, sendReportsByEmail } from "../controllers/orderController.js";

const router = express.Router();

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

router.post("/", async (req, res) => {
  const orderDetails = req.body;

  const order = new Order(orderDetails);
  try {
    const savedOrder = await order.save();
    res.json({
      success: true,
      message: "Order processed successfully",
      order: savedOrder,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error processing order",
        error: error.message,
      });
  }
});

router.get("/", async (req, res) => {
  try {
    console.log("API Route Hit: GET /api/orders"); // Log 1
    const orders = await Order.find(); // Fetch all orders from the database
    console.log("Orders Fetched:", orders); // Log 2
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error Fetching Orders:", error.message); // Log 3
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
});

router.put('/api/orders/:orderId', async (req, res) => {
  const orderId = req.params.orderId;
  const { selectedDates } = req.body;

  try {
    // Update the order with the selected dates
    await Order.findByIdAndUpdate(orderId, { selectedDates });

    res.status(200).json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Error updating selected dates:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/:orderId/upload-report', upload.array('report'), uploadReport);
router.get("/:orderId/download-reports", downloadReports);
router.post("/:orderId/send-reports-by-email", sendReportsByEmail);

export default router;
