const notificationModel = require('../models/notifcationmodel');
const jwt = require('jsonwebtoken');
const FetchNotifications = async (req, res) => {
    try {
        console.log('Fetching notifications...');
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        const storeID = decoded.storeID;
        console.log('Decoded storeID:', storeID);
        if (!token) {
            res.clearCookie('token');
            return res.status(401).json({ message: 'Unauthorized, Please Login Again' });
        }
       
        const notifications = await notificationModel.find({ storeID: storeID }).sort({ createdAt: -1 });
        res.status(200).json({ message: 'Notifications fetched successfully', success: true, notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
}


const MarkAsRead = async (req, res) => {
    const notifications = req.body.notifications;

    try {
        notifications.forEach(async notifcation => {
            const notificationId = notifcation._id;
            const notification = await notificationModel.findById(notificationId);
            notification.isRead = true;
            await notification.save();
        });
        res.status(200).json({success: true, message: 'Notifications marked as read' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to mark notifications as read' });
    }
}

const CreateNotification = async (req, res) => { }

module.exports = {
    FetchNotifications,
    MarkAsRead,
    CreateNotification
}