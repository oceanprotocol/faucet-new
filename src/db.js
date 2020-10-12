const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

// Connection URL

let password = encodeURIComponent(process.env.DB_PASSWORD)
const url = `mongodb://${process.env.DB_USER}:${password}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
console.log("URL - ", url)
// Use connect method to connect to the server
async function connection() {
    try {
        let client = await MongoClient.connect(url, { useUnifiedTopology: true })
        console.log("Connected successfully to server");
        return client
    } catch (err) {
        console.error(err)
    }
}

module.exports = { connection }