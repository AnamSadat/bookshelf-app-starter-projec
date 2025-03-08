const bookArray = [];
const RENDER_EVENT = "render-book";
const STORAGE_KEY = "BOOKSHELF_APP";
const SAVED_EVENT = "save-book";

document.addEventListener("DOMContentLoaded", function () {
  const submitBook = document.getElementById("bookFormSubmit");
  document.querySelector("#incompleteBookList").innerHTML = "";
  document.querySelector("#completeBookList").innerHTML = "";

  submitBook.addEventListener("click", function (event) {
    event.preventDefault();
    console.log("muncul");
    addBook();
  });
});

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function addBook() {
  const bookId = generateId();
  const title = document.querySelector("#bookFormTitle").value;
  const year = document.querySelector("#bookFormYear").value;
  const author = document.querySelector("#bookFormAuthor").value;
  const isCompleted = document.querySelector("#bookFormIsComplete").checked;

  const newBook = generateBookObject(bookId, title, author, year, isCompleted);

  bookArray.push(newBook);
  document.querySelector("#bookFormTitle").value = "";
  document.querySelector("#bookFormYear").value = "";
  document.querySelector("#bookFormAuthor").value = "";
  document.querySelector("#bookFormIsComplete").checked = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(RENDER_EVENT, function () {
  console.log("🔄 Rendering Books...");
  console.log("📚 Isi bookArray:", bookArray); // Tambahkan ini
  renderBooks();
  console.log(bookArray);
  console.log(renderBooks());
});

function createBookElement(bookObject) {
  // const bookItem = document.createElement("div");
  // bookItem.setAttribute("data-bookid", bookObject.id);
  // bookItem.setAttribute("data-testid", );

  const completeBook = document.querySelector("#completeBookList");
  completeBook.removeAttribute("hidden");
  const bookItem = document.createElement("div");
  bookItem.setAttribute("data-bookid", bookObject.id);
  bookItem.setAttribute("data-testid", "bookItem");

  bookItem.innerHTML = `
    <h3 data-testid="bookItemTitle">${bookObject.title}</h3>
    <p data-testid="bookItemAuthor">Penulis: ${bookObject.author}</p>
    <p data-testid="bookItemYear">Tahun: ${bookObject.year}</p>
    <div>
      <button data-testid="bookItemIsCompleteButton">
      ${bookObject.isCompleted ? "Sudah Selesai" : "Belum Selesai"}
      </button>
      <button data-testid="bookItemDeleteButton">Hapus Buku</button>
      <button data-testid="bookItemEditButton">Edit Buku</button>
    </div>
  `;

  // bookItem.switchBook();
  const switchIsComplete = document.querySelector(
    "[data-testid='bookItemIsCompleteButton']"
  );
  switchIsComplete.addEventListener("click", function (bookId) {
    switchBook(bookObject.id);
  });

  return bookItem;
}

function renderBooks() {
  const incompleteBookList = document.querySelector("#incompleteBookList");
  const completeBookList = document.querySelector("#completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";
  bookArray.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isCompleted) {
      completeBookList.append(bookElement);
      console.log("sudah");
    } else {
      incompleteBookList.append(bookElement);
      console.log("belum");
    }
  });
}

function findBookIndex(bookId) {
  for (const index in bookArray) {
    if (bookArray[index].id === bookId) {
      return index;
    }
  }
  return -1;
}
function switchBook(bookId) {
  let books = bookArray;
  books = books.map((bookArray) => {
    if (bookArray.id === bookId) {
      bookArray.isComplete = !bookArray.isComplete;
    }
    return bookArray;
  });
}
