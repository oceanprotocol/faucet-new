require('dotenv').config()
const sqlite3 = require('sqlite3').verbose()
let db

async function connection() {
  try {
    db = new sqlite3.Database(
      `${process.env.DB_PATH}`,
      sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          return console.error(err.message)
        }
        console.log('Connected to the in-memory SQlite database.')
        db.run(
          'CREATE TABLE IF NOT EXISTS users(ip text, wallet text, lastUpdatedOn text)'
        )
      }
    )
  } catch (err) {
    console.error(err)
  }
}

async function insert(ip, wallet, date) {
  // Insert some documents
  try {
    db.run(
      `INSERT INTO users(ip, wallet, lastUpdatedOn) VALUES(?, ?, ?)`,
      [ip, wallet, date],
      function (err) {
        if (err) {
          return console.log(err.message)
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`)
      }
    )
  } catch (err) {
    console.error(err)
  }
}

connection('Test', '123123', 'Today')
insert()
