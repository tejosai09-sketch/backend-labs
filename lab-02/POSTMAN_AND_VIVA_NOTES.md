# Postman test cases (Lab 2)

Base URL: http://localhost:3000

| # | Method | URL | Body (JSON) | Expected |
| --- | --- | --- | --- | --- |
| 1 | GET | /books/ | – | 200, array of books |
| 2 | GET | /books/1/ | – | 200, one book |
| 3 | GET | /books/999/ | – | 404 |
| 4 | POST | /books/ | {"title":"New Book","author":"Me","price":400,"pages":200} | 201, bookId |
| 5 | POST | /books/ | {"title":""} | 400 |
| 6 | PUT | /books/1/ | {"title":"Clean Code 2","author":"Robert C. Martin","price":620,"pages":470} | 200 |
| 7 | DELETE | /books/2/ | – | 200 |
| 8 | DELETE | /books/2/ | – | 404 (already deleted) |

Compare with CLI: `sqlite3 book.db "SELECT * FROM book;"`

# Viva answers

**Why await the database call?** DB calls are asynchronous and return Promises; `await` pauses that handler until the result is ready, so we don't use an unresolved Promise as data, and the event loop stays free for other requests.

**What is SQL injection and how do placeholders prevent it?** Attacker-supplied input is concatenated into a SQL string and changes the query's meaning (e.g. `1 OR 1=1`). With `?` placeholders the SQL is compiled first and values are bound separately as data, so they can never be executed as SQL.

**When is PUT used instead of POST?** POST creates a new resource (server assigns the id). PUT replaces/updates an existing resource at a known URL (`/books/:bookId/`) and is idempotent.
