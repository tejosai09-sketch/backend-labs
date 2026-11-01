const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "book.db");
const PORT = process.env.PORT || 3000;

let db = null;

// Opens the database and starts the server only after the connection succeeds.
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    await db.exec(`
      CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY,
        title TEXT,
        author TEXT,
        price INTEGER,
        pages INTEGER
      );
    `);
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// Validates a book body; returns an error message or null.
const validateBook = ({ title, author, price, pages }) => {
  if (typeof title !== "string" || title.trim() === "") return "title is required";
  if (typeof author !== "string" || author.trim() === "") return "author is required";
  if (!Number.isInteger(price) || price < 0) return "price must be a non-negative integer";
  if (!Number.isInteger(pages) || pages <= 0) return "pages must be a positive integer";
  return null;
};

const isValidId = (id) => /^\d+$/.test(id);

// 1. GET all books
app.get("/books/", async (request, response) => {
  try {
    const books = await db.all("SELECT * FROM book ORDER BY id;");
    response.status(200).send(books);
  } catch (error) {
    response.status(500).send({ error: "Internal server error" });
  }
});

// 2. GET one book
app.get("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  if (!isValidId(bookId)) return response.status(400).send({ error: "Invalid book id" });
  try {
    const book = await db.get("SELECT * FROM book WHERE id = ?;", [bookId]);
    if (!book) return response.status(404).send({ error: "Book not found" });
    response.status(200).send(book);
  } catch (error) {
    response.status(500).send({ error: "Internal server error" });
  }
});

// 3. POST add a book
app.post("/books/", async (request, response) => {
  const message = validateBook(request.body || {});
  if (message) return response.status(400).send({ error: message });
  const { title, author, price, pages } = request.body;
  try {
    const result = await db.run(
      "INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?);",
      [title, author, price, pages]
    );
    response.status(201).send({ message: "Book added successfully", bookId: result.lastID });
  } catch (error) {
    response.status(500).send({ error: "Internal server error" });
  }
});

// 4. PUT update a book
app.put("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  if (!isValidId(bookId)) return response.status(400).send({ error: "Invalid book id" });
  const message = validateBook(request.body || {});
  if (message) return response.status(400).send({ error: message });
  const { title, author, price, pages } = request.body;
  try {
    const result = await db.run(
      "UPDATE book SET title = ?, author = ?, price = ?, pages = ? WHERE id = ?;",
      [title, author, price, pages, bookId]
    );
    if (result.changes === 0) return response.status(404).send({ error: "Book not found" });
    response.status(200).send({ message: "Book updated successfully" });
  } catch (error) {
    response.status(500).send({ error: "Internal server error" });
  }
});

// 5. DELETE a book
app.delete("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  if (!isValidId(bookId)) return response.status(400).send({ error: "Invalid book id" });
  try {
    const result = await db.run("DELETE FROM book WHERE id = ?;", [bookId]);
    if (result.changes === 0) return response.status(404).send({ error: "Book not found" });
    response.status(200).send({ message: "Book deleted successfully" });
  } catch (error) {
    response.status(500).send({ error: "Internal server error" });
  }
});

module.exports = app;
