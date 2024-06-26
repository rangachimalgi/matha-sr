import express from "express";
import dotenv from "dotenv";
import path, { dirname } from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import twilio from "twilio";
import cron from "node-cron";  
import adminRoutes from "./routes/adminRoutes.js"
import apiRoutes from "./routes/apiRoutes.js"
import "./keepAlive.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

dotenv.config();

connectDB();

const app = express();

const accountSid = "AC01bd42f2b1e17f25a67a451502ec83b2";
const authToken = "8b7a3b58adcd5fa3e0f6456e1c03b121";
const client = new twilio(accountSid, authToken);

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.use("/api/auth", (req, res, next) => {
  console.log(`API Request Received: ${new Date().toISOString()} - Method: ${req.method} - Path: ${req.originalUrl}`);
  next();
}, authRoutes);

app.use("/api/orders", (req, res, next) => {
  console.log(`API Request Received: ${new Date().toISOString()} - Method: ${req.method} - Path: ${req.originalUrl}`);
  next();
}, orderRoutes);

app.use('uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.static(path.join(__dirname, 'client', 'build')));

app.get('*', function (req, res) {
  const index = path.join(__dirname, 'client', 'build', 'index.html');
  res.sendFile(index);
});

// app.post('/send-whatsapp', async (req, res) => {
//   const { to, message } = req.body;

//    // Hardcode the 'to' phone number for testing
//    const toPhoneNumber = '+917259672141';

//   try {
//     const result = await client.messages.create({
//       body: message,
//       from: fromPhoneNumber,
//       to: `whatsapp:${toPhoneNumber}`,
//     });

//     console.log(result);
//     res.status(200).json({ success: true });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// Scheduled messages array
const scheduledMessages = [];

// Schedule messages task
cron.schedule('*/5 * * * *', () => {
  const currentDate = new Date();
  scheduledMessages.forEach((scheduledMessage, index) => {
    const { phoneNumber, message, scheduledDate } = scheduledMessage;
    const sendDate = new Date(scheduledDate);

    // Check if it's time to send the message (e.g., a day before the scheduled date)
    if (sendDate.getDate() === currentDate.getDate() - 1) {
      // Send the message using Twilio
      client.messages.create({
        body: message,
        from: fromPhoneNumber, // Replace with your Twilio SMS-enabled number
        to: phoneNumber,
      });

      // Remove the scheduled message from the array
      scheduledMessages.splice(index, 1);
    }
  });
});

const fromPhoneNumber = process.env.TWILIO_SMS_NUMBER; 

// Schedule messages task
cron.schedule('*/5 * * * *', () => {
  const currentDate = new Date();
  scheduledMessages.forEach((scheduledMessage, index) => {
    const { phoneNumber, message, scheduledDate } = scheduledMessage;
    const sendDate = new Date(scheduledDate);

    // Check if it's time to send the message (e.g., a day before the scheduled date)
    if (sendDate.getDate() === currentDate.getDate() - 1) {
      // Send the message using Twilio
      client.messages.create({
        body: message,
        from: fromPhoneNumber, // Use the TWILIO_SMS_NUMBER environment variable
        to: phoneNumber,
      });

      // Remove the scheduled message from the array
      scheduledMessages.splice(index, 1);
    }
  });
});


// Endpoint to send an instant message
app.post('/api/send-instant-message', async (req, res) => {

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  const twilioSMSNumber = process.env.TWILIO_SMS_NUMBER; // Change this line
  const client = new twilio(accountSid, authToken);
  
  const { phoneNumber, message } = req.body;
  
  try {
    // Use Twilio or your preferred messaging service to send the instant message
    const result = await client.messages.create({
      body: message,
      from: twilioSMSNumber, // Replace with your Twilio SMS-enabled number
      to: phoneNumber,
      messagingServiceSid: messagingServiceSid, // Replace with your Twilio Messaging Service SID
    });
  
    console.log('Instant message sent successfully:', result);
    res.status(200).json({ success: true, message: 'Instant message sent successfully.' });
  } catch (error) {
    console.error('Error sending instant message:', error);
    res.status(500).json({ success: false, error: 'Error sending instant message.' });
  }
});

app.post('/api/receive_sms', (req, res) => {
  // Extract the message body (the SMS content), sender's number, and other details from the request
  const { Body, From } = req.body;
  console.log(`Received SMS from ${From}: ${Body}`);  // Log the message content and sender

  // You can add more logic here if you need to process the message further

  // Respond to Twilio's HTTP POST request
  res.status(200).send('<Response></Response>'); // Sending an empty TwiML response to Twilio
});

const PORT = process.env.PORT || 8085;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
