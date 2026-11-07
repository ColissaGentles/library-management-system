//  Grab the elements from the page 
const bookForm = document.getElementById("book-form");
const titleInput = document.getElementById("book-title");
const authorInput = document.getElementById("book-author");
const categorySelect = document.getElementById("book-category");
const bookList = document.getElementById("book-list");

// ----- 2. The key for localStorage, and the array that holds our books -----
const STORAGE_KEY = "libraryBooks";
let books = [];

// Storage functions

// Turn the books array into a JSON string and save it in the browser
function saveBooks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// Read the saved JSON string back into an array
// If nothing is saved yet, return an empty array
function loadBooks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return [];
}
// ----- 4. Show all books on the page -----
function renderBooks() {
  bookList.innerHTML = ""; // clear the list first

  if (books.length === 0) {
    bookList.textContent = "No books yet. Add one!";
    return;
  }

  books.forEach(function (book) {
    // the card
    const item = document.createElement("div");
    item.className = "book-item " + book.category;
    if (book.borrowed) {
      item.classList.add("borrowed");
    }
    item.dataset.id = book.id; // remember which book this card is

    // left side: title, badge, author
    const info = document.createElement("div");
    info.className = "book-info";

    const title = document.createElement("span");
    title.className = "book-title";
    title.textContent = book.title;

    const badge = document.createElement("span");
    badge.className = "badge " + (book.borrowed ? "borrowed" : "available");
    badge.textContent = book.borrowed ? "Borrowed" : "Available";
    title.appendChild(badge);

    const author = document.createElement("span");
    author.className = "book-author";
    author.textContent = "by " + book.author;

    info.appendChild(title);
    info.appendChild(author);

    // right side: buttons
    const actions = document.createElement("div");
    actions.className = "book-actions";

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "toggle-btn";
    toggleBtn.dataset.action = "toggle";
    toggleBtn.textContent = book.borrowed ? "Return" : "Borrow";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.dataset.action = "delete";
    deleteBtn.textContent = "Delete";

    actions.appendChild(toggleBtn);
    actions.appendChild(deleteBtn);

    // put it all together
    item.appendChild(info);
    item.appendChild(actions);
    bookList.appendChild(item);
  });
}

// ----- 5. Add a new book -----
function addBook(title, author, category) {
  const newBook = {
    id: Date.now(),
    title: title,
    author: author,
    category: category,
    borrowed: false,
  };
  books.push(newBook);
  saveBooks();
  renderBooks();
}

// ----- 6. Form submit event -----
bookForm.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const category = categorySelect.value;

  if (title === "" || author === "") return;

  addBook(title, author, category);

  bookForm.reset();
  categorySelect.value = "medium";
  titleInput.focus();
});

// ----- 7. When the page loads, show saved books -----
// ----- 8. Borrow / return a book -----
function toggleBook(id) {
  const book = books.find(function (b) {
    return b.id === id;
  });
  if (!book) return;

  book.borrowed = !book.borrowed; // flip true/false
  saveBooks();
  renderBooks();
}

// ----- 9. Delete a book -----
function deleteBook(id) {
  books = books.filter(function (b) {
    return b.id !== id;
  });
  saveBooks();
  renderBooks();
}

// ----- 10. Click event on the list (event delegation) -----
bookList.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return; // click wasn't on a button

  const card = button.closest(".book-item");
  const id = Number(card.dataset.id);

  if (button.dataset.action === "toggle") {
    toggleBook(id);
  } else if (button.dataset.action === "delete") {
    deleteBook(id);
  }
});
books = loadBooks();
renderBooks();