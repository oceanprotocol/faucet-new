MongoClient = require("mongodb") . MongoClient;
require("dotenv").config();
var client = null;

// Connection URL

let password = encodeURIComponent(process.env.DB_PASSWORD);
const url = `mongodb://${process.env.DB_USER}:${password}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
console.log("URL - ", url);
// Use connect method to connect to the server
async function connection() {
  try {
    client = await MongoClient.connect(url, { useUnifiedTopology: true });
    console.log("Connected successfully to server");
    return client;
  } catch (err) {
    console.error(err);
  }
}

async function insert(records, callback) {
  // Get the documents collection
  console.log("client - ", client);
  let db = client.db(process.env.DB_NAME);
  const collection = db.collection("records");
  // Insert some documents
  try {
    await collection.save(records, function(err, result) {
      console.log("Inserted into database");
      callback(result);
    });
  } catch (err) {
    console.error(err);
  }
}

async function find(query, callback) {
  // Get the documents collection
  let db = client.db(process.env.DB_NAME);
  const collection = db.collection("records");
  collection
    .find(query)
    .sort({ lastUpdatedOn: -1 })
    .toArray(function(err, docs) {
      console.log("Found the following records");
      console.log(docs);
      callback(docs);
    });
}

module.exports = { connection, insert, find };
