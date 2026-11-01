CREATE TABLE IF NOT EXISTS book (
  id INTEGER PRIMARY KEY,
  title TEXT,
  author TEXT,
  price INTEGER,
  pages INTEGER
);

INSERT INTO book (id, title, author, price, pages) VALUES
(1, 'Clean Code', 'Robert C. Martin', 599, 464),
(2, 'The Pragmatic Programmer', 'Andrew Hunt', 650, 352),
(3, 'You Don''t Know JS', 'Kyle Simpson', 450, 278),
(4, 'Eloquent JavaScript', 'Marijn Haverbeke', 520, 472),
(5, 'Node.js Design Patterns', 'Mario Casciaro', 799, 660),
(6, 'Learning SQL', 'Alan Beaulieu', 575, 380),
(7, 'Designing Data-Intensive Applications', 'Martin Kleppmann', 899, 616),
(8, 'Refactoring', 'Martin Fowler', 725, 448),
(9, 'Introduction to Algorithms', 'Thomas H. Cormen', 950, 1312),
(10, 'JavaScript: The Good Parts', 'Douglas Crockford', 350, 176);
