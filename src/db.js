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
          'CREATE TABLE IF NOT EXISTS users(ip text, wallet text, lastUpdatedOn integer)'
        )
      }
    )
  } catch (err) {
    console.error(err)
  }
}

async function find(address, callback) {
  try {
    db.all(`SELECT * FROM users`, [], function (err, db) {
      if (err) {
        return console.log(err.message)
      }
      db.forEach((element) => {
        console.log('DB:', element, element.ip, element.wallet)
      })
    })
  } catch (err) {
    console.error(err)
  }

  try {
    db.all(
      `SELECT wallet, lastUpdatedOn FROM users WHERE wallet = "${address}" ORDER BY lastUpdatedOn DESC`,
      [],
      function (err, row) {
        if (err) {
          return console.log(err.message)
        }
        console.log(`A row has been found ${row}`)
        callback(row)
      }
    )
  } catch (err) {
    console.error(err)
  }
}

async function insert(record, callback) {
  console.log('Inserting: ', record.ip, record.wallet, record.lastUpdatedOn)
  // Insert some documents
  try {
    db.run(
      `INSERT INTO users(ip, wallet, lastUpdatedOn) VALUES(?, ?, ?)`,
      [record.ip, record.wallet, record.lastUpdatedOn],
      function (err) {
        if (err) {
          return console.log(err.message)
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`)
        console.log(`This row has been inserted: ${this.changes}`)
      },
      callback()
    )
  } catch (err) {
    console.error(err)
  }
  try {
    db.all(`SELECT * FROM users`, [], function (err, db) {
      if (err) {
        return console.log(err.message)
      }
      console.log(`DB after Insert: ${db}`)
    })
  } catch (err) {
    console.error(err)
  }
}

module.exports = { connection, insert, find }
