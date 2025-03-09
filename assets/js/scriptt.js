export default function removeBook(bookId) {
  // Buat elemen modal
  const modal = document.createElement("div");
  modal.classList.add("modal");
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
  modalContent.classList.add("modal-content");
  modalContent.style.background = "white";
  modalContent.style.padding = "20px";
  modalContent.style.borderRadius = "8px";
  modalContent.style.textAlign = "center";

  // Tambahkan teks konfirmasi
  const modalText = document.createElement("p");
  modalText.innerText = "Apakah Anda yakin ingin menghapus buku ini?";

  // Tombol "Ya"
  const confirmButton = document.createElement("button");
  confirmButton.innerText = "Ya";
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
}
