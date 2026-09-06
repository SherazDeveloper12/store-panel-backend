const mongoose = require('mongoose');
const customermodel = require('../models/customermodel');
const jwt = require('jsonwebtoken');
const { sendEmailtoCustomer } = require('../services/emailSender');
const contactCustomer = async (req, res) => {
     try {
         const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized', success: false });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);
        if (!decoded || !decoded.storeID) {
            return res.status(401).json({ message: 'Unauthorized', success: false });
        }
        const storeID = decoded.storeID;
        const storeName = decoded.storeName;
        const replyTo = decoded.email;
       const {customerEmail, subject, message} = req.body;
       console.log("customerEmail:", customerEmail, "subject:", subject, "message:", message, "replyTo:", replyTo);
        if (!customerEmail || !subject || !message) {
            return res.status(400).json({ message: 'Missing required fields', success: false });
        }
        const customer = await customermodel.findOne({ email: customerEmail, storeID: storeID });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found', success: false });
        }
        const messageToSend = `<p>${message}</p>`;
      console.log("Sending email to customer:", customerEmail, "with subject:", subject, "and message:", message, "will reply to:", replyTo);
       const sendEmail = await sendEmailtoCustomer(storeName, customerEmail, replyTo, subject, messageToSend) 
      console.log("Email sent successfully:", sendEmail);
       res.status(200).json({ success: true, message: "Email sent successfully", email: sendEmail });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
}
const getAllcustomers = async (req, res) => {
    try {
         const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized', success: false });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.storeID) {
            return res.status(401).json({ message: 'Unauthorized', success: false });
        }
        const storeID = decoded.storeID;
        const customers = await customermodel.find({ storeID: storeID });
        res.status(200).json({ success: true, message: "Customers fetched successfully", customers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch customers' });
    }
     
        
}
module.exports = { contactCustomer, getAllcustomers,  };