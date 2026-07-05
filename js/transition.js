// =============================================
// DATA URUTAN HALAMAN
// =============================================

// menyimpan daftar halaman beserta urutannya
// digunakan untuk menentukan arah animasi pindah halaman

const pages = {
    "index.html": 0,
    "rooms.html": 1,
    "games.html": 2,
    "dashboard.html": 3,
    "about.html": 4,
    "reservation.html": 5,
    "transaction.html": 6
};

// =============================================
// CEK HALAMAN SAAT INI
// =============================================

const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

const currentIndex = pages[currentPage] ?? 0;

// Animasi masuk
const direction = sessionStorage.getItem("navDirection");

window.addEventListener("DOMContentLoaded", () => {
    if (direction === "right") {
        document.body.classList.add("page-enter-right");
    } else if (direction === "left") {
        document.body.classList.add("page-enter-left");
    }

    // =============================================
    // EVENT SEMUA LINK
    // =============================================

    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function (e) {
            const href = this.getAttribute("href");

            if (!href || href.startsWith("#")) return;

            const targetIndex = pages[href];
            if (targetIndex === undefined) return;

            e.preventDefault();

            if (targetIndex > currentIndex) {
                // pindah ke menu kanan
                sessionStorage.setItem("navDirection", "right");
                document.body.classList.add("page-exit-left");
            } else {
                // pindah ke menu kiri
                sessionStorage.setItem("navDirection", "left");
                document.body.classList.add("page-exit-right");
            }

            setTimeout(() => {
                window.location.href = href;
            }, 350);
        });
    });
});