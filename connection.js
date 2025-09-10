require('dotenv').config();
const { MongoClient } = require('mongodb');

async function main(callback) { 
    const URI = process.env.MONGO_URI;
    const client = new MongoClient(URI);

    try {
        await client.connect();
        await callback(client);
    }

    catch (e) {
        console.error(e);
        throw new Error('Unable to connect to Database');
    }
}

module.exports = main;