
const mongoose = require('mongoose');

const main = async () => {
    console.log('Connecting to the database...');
    console.log('Database URL:', process.env.DB_URL); // Log the database URL for debugging
    try {
        await mongoose.connect(process.env.DB_URL, {
            dbName: 'StorePannelDB',
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
    }
};

module.exports = main;