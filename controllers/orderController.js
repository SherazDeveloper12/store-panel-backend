const notificationModel = require('../models/notifcationmodel');
const orderModel = require('../models/ordermodel');
const productModel = require('../models/productmodel');
const authModel = require('../models/authmodel');
const { sendEmail } = require('../services/emailSender');
const customermodel = require('../models/customermodel');
var jwt = require('jsonwebtoken');
const couponModel = require('../models/couponModel');
const createOrder = async (req, res) => {
    try {

        const orderdetails = req.body;
        console.log("orderdetails", orderdetails);
        const storeID = orderdetails.storeID;
        if (!storeID) {
            return res.status(400).json({ status: "Failed", message: "Store ID is required" });
        }
        const user = await authModel.findById(storeID);
        if (!user) {
            return res.status(404).json({ status: "Failed", message: "Store not found" });
        }
        if (orderdetails.paymentMethod !== "cod" && !orderdetails.paymentReceipt) {
            return res.status(400).json({ status: "Failed", message: "Payment receipt is required for non-COD payment methods" });
        }
        const deliveryCharges = user.storeDeliveryCharges;

        let oldOrder = {
            username: orderdetails.username,
            customerId: orderdetails.userid,
            items: orderdetails.items,
            shippingAddress: orderdetails.shippingAddress,
            billingAddress: orderdetails.billingAddress,
            phoneNumber: orderdetails.phoneNumber,
            email: orderdetails.email,
            status: orderdetails.status,
            deliveryCharges: deliveryCharges,
            payableAmount: 0,
            orderDate: orderdetails.orderDate,
            storeID: orderdetails.storeID,
            couponCode: orderdetails.couponCode,
            couponApplied: false,
            couponDiscount: null,
            paymentMethod: orderdetails.paymentMethod,
        }

        let couponDiscount = null;
        const couponCode = orderdetails.couponCode;
        console.log("couponCode", couponCode);
        if (couponCode) {

            const coupons = await couponModel.find({ storeID: storeID });
            console.log("coupons", coupons);
            const coupon = coupons.find(coupon => coupon.couponCode === couponCode);
            if (!coupon) {
                console.log("Invalid coupon code");
                return res.status(400).json({ status: "Failed", message: "Invalid coupon code" });
            }
            else if (coupon.expirationDate < new Date()) {
                console.log("Coupon has expired");
                return res.status(400).json({ success: false, message: 'Coupon has expired' });
            }
            else if (coupon.usageCount === coupon.maxUsage) {
                console.log("Coupon usage limit reached");
                return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
            }
            else if (!coupon.isActive) {
                console.log("Coupon is not active");
                return res.status(400).json({ success: false, message: 'Coupon is not active' });
            }
            else {
                couponDiscount = coupon.discountPercentage;
                oldOrder.couponDiscount = couponDiscount;
                oldOrder.couponApplied = true;
                coupon.usedtimes += 1;
                coupon.updatedAt = new Date();
                coupon.status = coupon.usedtimes >= coupon.maxUsage ? 'used' : coupon.status;
                console.log("Updated Coupon", coupon);
                await coupon.save();
            }

        }

        const products = await productModel.find()
        const totalProductsCost = orderdetails.items.reduce((total, item) => (total + (products.find(product => product._id.toString() === item.product._id).price) * item.quantity), 0);
        oldOrder.payableAmount = totalProductsCost + deliveryCharges;
        if (couponDiscount) {
            oldOrder.payableAmount = Math.round(totalProductsCost + deliveryCharges - (totalProductsCost * couponDiscount / 100));
        }

        if (orderdetails.paymentMethod !== "cod") {
            oldOrder = { ...oldOrder, paymentReceipt: orderdetails.paymentReceipt };
        }
        console.log("oldOrder", oldOrder);

        const orderCreated = new orderModel(oldOrder);
        const savedOrder = await orderCreated.save();
        const storeOwner = await authModel.findById(orderdetails.storeID);
        const notification = {
            recipientid: storeOwner._id,
            message: `New order has been placed successfully. Order ID: ${savedOrder._id}`,
            type: 'Order',
            data: {
                orderId: savedOrder._id,
            },
            storeID: orderdetails.storeID
        }
        const notificationCreated = new notificationModel(notification);
        await notificationCreated.save();
        const orders = await orderModel.find({ storeID: orderdetails.storeID });
        if (orders.length === 1) {
            const Notifcation = {
                recipientid: orderdetails.userid,
                message: `Congratulations! You have placed your first order with us. Order ID: ${savedOrder._id}`,
                type: 'Growth',
                data: { orderId: savedOrder._id },
                storeID: orderdetails.storeID
            };
            const notificationCreated = new notificationModel(Notifcation);
            await notificationCreated.save();
        }
        else if (orders.length === 5) {
            const Notifcation = {
                recipientid: orderdetails.userid,
                message: `Great job! You've reached a milestone by placing 5 orders with us. Keep up the momentum and continue enjoying our products!`,
                type: 'Growth',
                data: {},
                storeID: orderdetails.storeID,
            };
            const notificationCreated = new notificationModel(Notifcation);
            await notificationCreated.save();
        }
        else if (orders.length === 10) {
            const Notifcation = {
                recipientid: orderdetails.userid,
                message: `Fantastic! You've achieved a significant milestone by placing 10 orders with us. Your dedication and loyalty are paying off. Keep up the great work!`,
                type: 'Growth',
                data: {},
                storeID: orderdetails.storeID,
            };
            const notificationCreated = new notificationModel(Notifcation);
            await notificationCreated.save();
        }
        else if (orders.length === 20) {
            const Notifcation = {
                recipientid: orderdetails.userid,
                message: `Amazing! You've reached an impressive milestone by placing 20 orders with us. Your commitment to our products and services is truly commendable. Keep pushing forward and enjoying our offerings!`,
                type: 'Growth',
                data: {},
                storeID: orderdetails.storeID,
            };
            const notificationCreated = new notificationModel(Notifcation);
            await notificationCreated.save();
        }
        else if (orders.length === 50) {
            const Notifcation = {
                recipientid: orderdetails.userid,
                message: `Incredible! You've reached an extraordinary milestone by placing 50 orders with us. Your dedication, loyalty, and support have truly paid off. This achievement is a testament to your commitment to our products and services. Keep inspiring others and enjoying our offerings!`,
                type: 'Growth',
                data: {},
                storeID: orderdetails.storeID,
            };
            const notificationCreated = new notificationModel(Notifcation);
            await notificationCreated.save();
        }


        // global.io.to(global.userSockets.get(orderdetails.userid)).emit('newOrderCreated', { notification: notificationCreated, order: savedOrder });
        const CreateCustomer = {
            uid: orderdetails.userid,
            name: orderdetails.shippingAddress.fullName,
            email: orderdetails.email,
            city: orderdetails.shippingAddress.city,
            phoneNumber: orderdetails.phoneNumber,
            totalOrders: 1,
            storeID: orderdetails.storeID,
        }
        const customerExists = await customermodel.findOne({ uid: orderdetails.userid, storeID: orderdetails.storeID });
        if (!customerExists) {
            const newCustomer = new customermodel(CreateCustomer);
            await newCustomer.save();
        } else {
            await customermodel.updateOne({ uid: orderdetails.userid, storeID: orderdetails.storeID }, { $inc: { totalOrders: 1 } });
        }

        const storeOwnerEmail = await authModel.findById(orderdetails.storeID).select('email');
        console.log("Store Owner Email:", storeOwnerEmail.email);
        const emailSubject = 'New Order Placed';
        const emailBody = `A new order has been placed by ${orderdetails.shippingAddress.fullName}. Order ID: ${savedOrder._id}. Please check your dashboard for more details.`;

        await sendEmail(storeOwnerEmail.email, emailSubject, emailBody);
        // const adminNotification = {
        //     recipientid: "69843421d30a0ace506d9172",
        //     message: `New Order Placed by ${orderdetails.shippingAddress.fullName}`,
        //     type: 'Order Creation',
        //     data: {
        //         orderId: savedOrder._id,
        //     }
        // }
        // const adminNotificationCreated = new notificationModel(adminNotification);
        // await adminNotificationCreated.save();
        // global.io.to(global.userSockets.get('69843421d30a0ace506d9172')).emit('newOrderCreated', { notification: adminNotificationCreated, order: savedOrder });
        // const notification = {
        //     recipientid: orderdetails.userid,
        //     message: `Your order has been placed successfully. Order ID: ${savedOrder._id}`,
        //     type: 'Order Creation',
        //     data: {
        //         orderId: savedOrder._id,
        //     }
        // }
        // const notificationCreated = new notificationModel(notification);
        // await notificationCreated.save();
        // global.io.to(global.userSockets.get(orderdetails.userid)).emit('newOrderCreated', { notification: notificationCreated, order: savedOrder });
        res.status(200).json({ status: "Success", order: savedOrder, message: "Order created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "Failed",
            message: "Order creation failed",
            error: error.message,
        });
    }
}

const getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json(order);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
}
const getAllOrders = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized', success: false });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.storeID) {
        return res.status(401).json({ message: 'Unauthorized', success: false });
    }
    const storeID = decoded.storeID;
    try {
        const orders = await orderModel.find({ storeID: storeID });
        res.status(200).json({ success: true, message: "Orders fetched successfully", orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
}

const updateOrderStatus = async (req, res) => {
    try {

        const orderId = req.params.id;
        console.log("Updating order status for order ID:", orderId);
        const { status } = req.body;
        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        order.status = status;
        const updatedOrder = await order.save();
        // const usersocketid = global.userSockets.get(order.userId);
        // global.io.to(usersocketid).emit('orderStatusUpdated', { updatedOrder });
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
}

const getOrdersByUserId = async (req, res) => {
    try {
        
        const customerId = req.params.userId;
        console.log("Fetching orders for customer ID:", customerId);
        const orders = await orderModel.find({ customerId });

        res.status(200).json({ status: "Success", orders, message: "Orders fetched successfully" });
    } catch (error) {
        res.status(500).json({ status: "Failed", message: "Failed to fetch orders", error: error.message });
    }
}
module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    getOrdersByUserId
};
