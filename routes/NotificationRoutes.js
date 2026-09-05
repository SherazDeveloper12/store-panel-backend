const express = require('express');
const notificationRouter = express.Router();
const verifyToken = require('../middlewares/verifytoken');
const { 
    FetchNotifications,
    // createNotification, 
    // getNotificationsByUserId, 
    MarkAsRead
 } = require('../controllers/notificationController');

// Route to create a new notification
// notificationRouter.post('/create', createNotification);
// Route to get notifications by user ID
notificationRouter.get('/',verifyToken, FetchNotifications);
// Route to mark a notification as read
notificationRouter.put('/mark-notifications-as-read/',verifyToken, MarkAsRead);
module.exports = notificationRouter;