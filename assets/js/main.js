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
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
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
  saveData();
}

document.addEventListener(RENDER_EVENT, function () {
  console.log("🔄 Rendering Books...");
  console.log("📚 Isi bookArray:", bookArray); // Tambahkan ini
  renderBooks();
  console.log("");
  saveData();
});

function createBookElement(bookObject) {
  const bookItem = document.createElement("div");
  bookItem.setAttribute("data-bookid", bookObject.id);
  bookItem.setAttribute("data-testid", "bookItem");

  bookItem.innerHTML = `
    <h3 data-testid="bookItemTitle">${bookObject.title}</h3>
    <p data-testid="bookItemAuthor">Penulis: ${bookObject.author}</p>
    <p data-testid="bookItemYear">Tahun: ${bookObject.year}</p>
    <div>
      <button data-testid="bookItemIsCompleteButton">
      ${bookObject.isCompleted ? "Belum Selesai" : "Sudah Selesai"}
      </button>
      <button data-testid="bookItemDeleteButton">Hapus Buku</button>
      <button data-testid="bookItemEditButton">Edit Buku</button>
    </div>
  `;

  bookItem
    .querySelector("[data-testid='bookItemIsCompleteButton']")
    .addEventListener("click", function () {
      switchBook(bookObject.id);
      console.log("Berhasil dipindahkan");
    });

  bookItem
    .querySelector("[data-testid='bookItemDeleteButton']")
    .addEventListener("click", function () {
      removeBook(bookObject.id);
      console.log("Berhasil dihapus");
    });

  bookItem
    .querySelector("[data-testid='bookItemEditButton']")
    .addEventListener("click", function () {
      editBook(bookObject.id);
      console.log("Berhasil Edit");
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
      console.log("sudah selesai");
    } else {
      incompleteBookList.append(bookElement);
      console.log("belum selesai");
    }
  });
}

function findBookIndex(bookId) {
  if (!Array.isArray(bookArray)) return -1;
  for (const index in bookArray) {
    if (bookArray[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function switchBook(bookId) {
  let bookIndex = findBookIndex(bookId);
  console.log("bookId = ", bookId);

  if (bookIndex !== -1) {
    bookArray[bookIndex].isCompleted = !bookArray[bookIndex].isCompleted;
    console.log("status = ", bookArray[bookIndex].isCompleted);
  } else {
    console.log("Buku tidak ditemukan");
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBook(bookId) {
  // Buat elemen modal
  const modal = document.createElement("div");
  modal.classList.add("container-pop-up");
  modal.style.position = "fixed";
  modal.style.zIndex = "100";
  modal.style.left = "0";
  modal.style.top = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";

  // Buat konten modal
  const modalContent = document.createElement("div");
  modalContent.classList.add("remove-content");
  modalContent.style.background = "white";
  modalContent.style.padding = "20px";
  modalContent.style.borderRadius = "8px";
  modalContent.style.textAlign = "center";

  // Tambahkan teks konfirmasi
  const modalText = document.createElement("p");
  modalText.innerText = "Apakah Anda yakin ingin menghapus buku ini?";

  // Tombol "Ya"
  const confirmButton = document.createElement("button");
  confirmButton.classList.add("btn-confirm-delete");
  confirmButton.innerText = "Hapus";
  confirmButton.style.margin = "5px";
  confirmButton.addEventListener("click", function () {
    const bookIndex = findBookIndex(bookId);
    if (bookIndex !== -1) {
      bookArray.splice(bookIndex, 1);
      document.dispatchEvent(new Event(RENDER_EVENT)); // Render ulang daftar buku
    }
    document.body.removeChild(modal); // Hapus modal setelah buku dihapus
  });

  // Tombol "Tidak"
  const cancelButton = document.createElement("button");
  cancelButton.innerText = "Tidak";
  cancelButton.style.margin = "5px";
  cancelButton.addEventListener("click", function () {
    document.body.removeChild(modal); // Hapus modal tanpa menghapus buku
  });

  // Gabungkan elemen modal
  modalContent.appendChild(modalText);
  modalContent.appendChild(confirmButton);
  modalContent.appendChild(cancelButton);
  modal.appendChild(modalContent);

  // Tambahkan modal ke dalam body
  document.body.appendChild(modal);
  saveData();
}

function editBook(bookId) {
  const bookIndex = findBookIndex(bookId);
  if (bookIndex === -1) {
    alert("Buku tidak ditemukan!");
    return;
  }

  const book = bookArray[bookIndex];

  // Buat formulir edit
  const editForm = document.createElement("div");
  editForm.classList.add("container-pop-up");

  editForm.innerHTML = `
      <div class="edit-container">
         <h2>Edit Buku</h2>
          <form id="bookForm" data-testid="bookForm">
            <div class="judul">
              <label class="label" for="bookFormTitle">Judul</label>
              <input
                id="editTitle"
                type="text"
                required
                value="${book.title}"
                data-testid="bookFormTitleInput"
              />
            </div>
            <div>
              <label class="label" for="bookFormAuthor">Penulis</label>
              <input
                id="editAuthor"
                type="text"
                required
                value="${book.author}"
                data-testid="bookFormAuthorInput"
              />
            </div>
            <div>
              <label class="label" for="bookFormYear">Tahun</label>
              <input
                id="editYear"
                type="number"
                required
                value="${book.year}"
                data-testid="bookFormYearInput"
              />
            </div>
            
            <button id="saveEdit">Simpan</button>
      <button id="cancelEdit">Batal</button>
          </form>
      </div>

      
  `;
  document.body.appendChild(editForm);

  // Event Listener untuk Simpan Edit
  document
    .getElementById("saveEdit")
    .addEventListener("click", function (event) {
      event.preventDefault();
      bookArray[bookIndex].title = document.getElementById("editTitle").value;
      bookArray[bookIndex].author = document.getElementById("editAuthor").value;
      bookArray[bookIndex].year = document.getElementById("editYear").value;
      console.log("sudah edit");

      console.log("Index buku yang diedit:", bookIndex);
      console.log("Data sebelum diedit:", bookArray[bookIndex]);

      document.dispatchEvent(new Event(RENDER_EVENT));
      document.body.removeChild(editForm);
    });

  // Event Listener untuk Batal
  document.getElementById("cancelEdit").addEventListener("click", function () {
    document.body.removeChild(editForm);
  });
  saveData();
}

function searchBook() {
  const query = document.getElementById("searchBookTitle").value.toLowerCase();

  // Mencari buku berdasarkan judul
  const foundBook = bookArray.find(
    (book) => book.title.toLowerCase() === query
  );

  // Jika buku tidak ditemukan, tampilkan pesan
  if (!foundBook) {
    alert("Buku tidak ditemukan!");
    return;
  }

  // Membuat modal pop-up
  const searchPopUp = document.createElement("div");
  searchPopUp.classList.add("container-pop-up");

  const searchPopUpContent = document.createElement("div");
  searchPopUpContent.classList.add("search-pop-up-content");

  const searchPopUpTitle = document.createElement("h2");

  if (foundBook.isCompleted) {
    searchPopUpTitle.innerText = "Sudah Selesai";
  } else {
    searchPopUpTitle.innerText = "Belum Selesai";
  }

  const searchPopUpContentText = document.createElement("div");
  searchPopUpContentText.id = "search-pop-up-content-text";

  const searchPopUpText = document.createElement("p");
  searchPopUpText.innerHTML = `

    <h3 data-testid="bookItemTitle">${foundBook.title}</h3>
    <p data-testid="bookItemAuthor">Penulis: ${foundBook.author}</p>
    <p data-testid="bookItemYear">Tahun: ${foundBook.year}</p>
    
  `;

  // Tombol Oke
  const okButton = document.createElement("button");
  okButton.classList.add("okeButton");
  okButton.innerText = "Oke";
  okButton.style.margin = "5px";
  okButton.addEventListener("click", function () {
    document.body.removeChild(searchPopUp);
  });

  // Menyusun modal
  searchPopUpContentText.appendChild(searchPopUpText);
  searchPopUpContent.appendChild(searchPopUpTitle);
  searchPopUpContent.appendChild(searchPopUpContentText);
  searchPopUpContent.appendChild(okButton);
  searchPopUp.appendChild(searchPopUpContent);

  // Tambahkan modal ke dalam body
  document.body.appendChild(searchPopUp);
}

document
  .getElementById("searchSubmit")
  .addEventListener("click", function (event) {
    event.preventDefault();
    searchBook();
    document.getElementById("searchBookTitle").value = "";
  });

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(bookArray);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung web storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      bookArray.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}
