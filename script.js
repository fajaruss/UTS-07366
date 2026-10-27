// ===== Ambil elemen yang dibutuhkan =====
const navbar = document.getElementById("navbar");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const tahun = document.getElementById("tahun");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section[id], footer[id]");


menuToggle.addEventListener("click", function () {
  const terbuka = navMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", terbuka);
  menuToggle.setAttribute("aria-label", terbuka ? "Tutup menu" : "Buka menu");
});

// Tutup menu setelah salah satu link diklik
function tutupMenu() {
  navMenu.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Buka menu");
}

navMenu.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", tutupMenu);
});

// Kalau layar dilebarkan lagi ke desktop, pastikan menu tertutup
// (angka 768 harus sama dengan breakpoint di CSS)
window.addEventListener("resize", function () {
  if (window.innerWidth > 768) {
    tutupMenu();
  }
});

// ===== Scroll: bayangan navbar + menu aktif =====

// Tandai link navbar sesuai section yang lagi kelihatan
function tandaiMenuAktif() {
  const posisi = window.scrollY + window.innerHeight / 3;
  let aktif = "";

  sections.forEach(function (sec) {
    if (posisi >= sec.offsetTop) {
      aktif = sec.id;
    }
  });

  // footer pendek, jadi dianggap aktif kalau sudah mentok di bawah
  const mentokBawah =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  if (mentokBawah) {
    aktif = "kontak";
  }

  navLinks.forEach(function (link) {
    link.classList.toggle("aktif", link.getAttribute("href") === "#" + aktif);
  });
}

window.addEventListener("scroll", function () {
  navbar.classList.toggle("scrolled", window.scrollY > 10);
  tandaiMenuAktif();
});

// jalankan sekali saat halaman dibuka
tandaiMenuAktif();

// ===== Form data diri + validasi =====
const formDaftar = document.getElementById("formDaftar");

if (formDaftar) {
  const inputNama = document.getElementById("nama");
  const inputAlamat = document.getElementById("alamat");
  const inputKota = document.getElementById("kota");
  const errNama = document.getElementById("errNama");
  const errAlamat = document.getElementById("errAlamat");
  const errKota = document.getElementById("errKota");
  const hobiList = formDaftar.querySelectorAll('input[name="hobi"]');
  const hasil = document.getElementById("hasilDaftar");

  // Tiap fungsi mengembalikan pesan error, atau "" kalau isinya sudah benar
  function cekNama() {
    const nilai = inputNama.value.trim();
    if (nilai === "") return "Nama wajib diisi.";
    if (nilai.length < 3) return "Nama minimal 3 huruf.";
    if (/\d/.test(nilai)) return "Nama tidak boleh berisi angka.";
    return "";
  }

  function cekAlamat() {
    const nilai = inputAlamat.value.trim();
    if (nilai === "") return "Alamat wajib diisi.";
    if (nilai.length < 10) return "Alamat terlalu singkat, tulis minimal 10 karakter.";
    return "";
  }

  function cekKota() {
    return inputKota.value === "" ? "Pilih salah satu kota." : "";
  }

  // Merah + pesan kalau salah, hijau kalau benar (class bawaan Bootstrap)
  function tampilkanStatus(input, elemenError, pesan) {
    elemenError.textContent = pesan;
    input.classList.toggle("is-invalid", pesan !== "");
    input.classList.toggle("is-valid", pesan === "");
    input.setAttribute("aria-invalid", pesan !== "");
  }

  function bersihkanStatus(input) {
    input.classList.remove("is-invalid", "is-valid");
    input.removeAttribute("aria-invalid");
  }

  // Setelah kolom pernah dicek, cek ulang langsung saat diisi
  function pasangCekLangsung(input, elemenError, fungsiCek) {
    input.addEventListener("input", function () {
      if (input.classList.contains("is-invalid") || input.classList.contains("is-valid")) {
        tampilkanStatus(input, elemenError, fungsiCek());
      }
    });
  }

  pasangCekLangsung(inputNama, errNama, cekNama);
  pasangCekLangsung(inputAlamat, errAlamat, cekAlamat);
  pasangCekLangsung(inputKota, errKota, cekKota);

  // Susun ringkasan data memakai elemen baru (tanpa innerHTML)
  function tampilkanHasil(nama, alamat, kota, hobi) {
    hasil.textContent = "";

    const judul = document.createElement("strong");
    judul.textContent = "Terima kasih, " + nama + "! Data kamu sudah kami terima.";

    const daftar = document.createElement("ul");
    daftar.className = "list-unstyled mt-2 mb-0";

    [
      ["Nama", nama],
      ["Alamat", alamat],
      ["Kota", kota],
      ["Hobi", hobi.length > 0 ? hobi.join(", ") : "-"]
    ].forEach(function (baris) {
      const item = document.createElement("li");
      item.textContent = baris[0] + ": " + baris[1];
      daftar.appendChild(item);
    });

    hasil.appendChild(judul);
    hasil.appendChild(daftar);
    hasil.classList.remove("d-none");
    hasil.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  formDaftar.addEventListener("submit", function (e) {
    e.preventDefault();

    const pesanNama = cekNama();
    const pesanAlamat = cekAlamat();
    const pesanKota = cekKota();

    tampilkanStatus(inputNama, errNama, pesanNama);
    tampilkanStatus(inputAlamat, errAlamat, pesanAlamat);
    tampilkanStatus(inputKota, errKota, pesanKota);

    hasil.classList.add("d-none");

    // kalau masih ada yang salah, berhenti dan fokus ke kolom pertama yang salah
    if (pesanNama || pesanAlamat || pesanKota) {
      if (pesanNama) inputNama.focus();
      else if (pesanAlamat) inputAlamat.focus();
      else inputKota.focus();
      return;
    }

    // semua benar: kumpulkan hobi yang dicentang
    const hobi = [];
    hobiList.forEach(function (kotak) {
      if (kotak.checked) hobi.push(kotak.value);
    });

    tampilkanHasil(inputNama.value.trim(), inputAlamat.value.trim(), inputKota.value, hobi);

    formDaftar.reset();
    [inputNama, inputAlamat, inputKota].forEach(bersihkanStatus);
  });
}

tahun.textContent = new Date().getFullYear();
