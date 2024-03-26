const db = require ('mongoose');
const router = require('express').Router();
const path = require('path');
const envPath = path.resolve(__dirname, '.env');

const dotenv = require('dotenv');
dotenv.config({ path: envPath });


async function connectToDatabase() {
    try {
        await db.connect(process.env.dburl);
        console.log('Connected to database');
    } catch (error) {
        console.error('Database connection error:', error);
    }
}

connectToDatabase();

 module.exports = router;