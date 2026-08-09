const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors');
const server = http.createServer(app);
const port = 5000;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRoutes');
const dotenv = require('dotenv');
const main = require('./config/db');
dotenv.config();

app.use(cors(
    {
        origin : process.env.FRONTEND_URL,
        credentials : true,
    }
));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




main();

app.get('/', (req, res) => {
    res.send('Hello World! I am Store Pannel Backend Server');
});

// Routes
app.use('/auth', authRouter);
app.use('/products', productRouter);
 server.listen(port, ()=>{
        console.log(`Server is running on port ${port}`);
    })