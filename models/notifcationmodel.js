const moongoose = require('mongoose');

const notificationSchema = new moongoose.Schema({
    recipientid: { type: String, ref: 'Auth', required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    type: { type: String, enum: ['General', 'Order', 'Coupon','Product','Growth',"System", 'Promotional'],  default: 'General' },
    data: { type: Object, default: {} },
    storeID: { type: String, ref: 'Auth', required: true },
},
    { timestamps: true });
notificationSchema.set('collection', 'notifications');

const notificationModel = moongoose.model('Notification', notificationSchema);
module.exports = notificationModel;