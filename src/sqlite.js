require('dotenv').config()
const sqlite3 = require('sqlite3').verbose()

let db = new sqlite3.Database(
  `${process.env.DB_PATH}`,
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      return console.error(err.message)
    }
    console.log('Connected to the in-memory SQlite database.')
  }
)

db.close((err) => {
  if (err) {
    return console.error(err.message)
  }
  console.log('Closed the database connection.')
})
