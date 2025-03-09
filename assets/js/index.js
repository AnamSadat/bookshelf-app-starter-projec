document.addEventListener("DOMContentLoaded", function () {
  const bookForm = document.getElementById("bookForm");
  const searchForm = document.getElementById("searchBook");
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  const STORAGE_KEY = "BOOKSHELF_APP";

  function getBooks() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }

  function saveBooks(books) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }

  function createBookElement(book) {
    const bookItem = document.createElement("div");
    bookItem.setAttribute("data-bookid", book.id);
    bookItem.setAttribute("data-testid", "bookItem");

    bookItem.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">
          ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
        </button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;

    bookItem
      .querySelector("[data-testid='bookItemIsCompleteButton']")
      .addEventListener("click", function () {
        toggleBookStatus(book.id);
      });

    bookItem
      .querySelector("[data-testid='bookItemDeleteButton']")
      .addEventListener("click", function () {
        deleteBook(book.id);
      });

    bookItem
      .querySelector("[data-testid='bookItemEditButton']")
      .addEventListener("click", function () {
        editBook(book.id);
      });

    return bookItem;
  }

  function renderBooks() {
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    getBooks().forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    });
  }

  function addBook(event) {
    event.preventDefault();

    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = document.getElementById("bookFormYear").value;
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    const newBook = {
      id: +new Date(),
      title,
      author,
      year,
      isComplete,
    };

    const books = getBooks();
    books.push(newBook);
    saveBooks(books);
    renderBooks();

    bookForm.reset();
  }

  function toggleBookStatus(bookId) {
    let books = getBooks();
    console.log("bookId = ", bookId);
    books = books.map((book) => {
      if (book.id === bookId) {
        book.isComplete = !book.isComplete;
      }
      return book;
    });
    saveBooks(books);
    renderBooks();
  }

  function deleteBook(bookId) {
    let books = getBooks();
    books = books.filter((book) => book.id !== bookId);
    saveBooks(books);
    renderBooks();
  }

  function editBook(bookId) {
    const books = getBooks();
    const bookToEdit = books.find((book) => book.id === bookId);

    if (!bookToEdit) return;

    document.getElementById("bookFormTitle").value = bookToEdit.title;
    document.getElementById("bookFormAuthor").value = bookToEdit.author;
    document.getElementById("bookFormYear").value = bookToEdit.year;
    document.getElementById("bookFormIsComplete").checked =
      bookToEdit.isComplete;

    deleteBook(bookId);
  }

  function searchBook(event) {
    event.preventDefault();
    const query = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();
    const books = getBooks();

    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    books.forEach((book) => {
      if (book.title.toLowerCase().includes(query)) {
        const bookElement = createBookElement(book);
        if (book.isComplete) {
          completeBookList.appendChild(bookElement);
        } else {
          incompleteBookList.appendChild(bookElement);
        }
      }
    });
  }

  bookForm.addEventListener("submit", addBook);
  searchForm.addEventListener("submit", searchBook);
  renderBooks();
});
