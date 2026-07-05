// ===========================
// DETAIL ROOM RENDER LOGIC
// ===========================

const params = new URLSearchParams(window.location.search);
const roomId = params.get("id");

const container = document.getElementById("detailContainer");

if (!container) {
    console.error("detailContainer tidak ditemukan");
}

const room = rooms.find(r => r.id === roomId);

// =======================================
// INFO STATIS LOUNGE (dipakai semua room)
// =======================================

const loungeInfo = {
    jamBuka: "10:00 - 02:00 WIB",
    alamat: "Jl. Gamer No. 21, Depok, Yogyakarta 55281",
    mapsLink: "https://www.google.com/maps/search/?api=1&query=Jl.+Gamer+No.+21+Depok+Yogyakarta"
};

// ===========================
// JIKA ROOM TIDAK ADA
// ===========================

if (!room) {

    container.innerHTML = `
        <div class="detail-card text-center detail-not-found">
            <h2>Room Tidak Ditemukan</h2>
            <p>Data room dengan ID <b>${roomId}</b> tidak ada.</p>

            <a href="rooms.html" class="btn-book">
                Kembali ke Rooms
            </a>
        </div>
    `;

}

// ===========================
// JIKA ROOM DITEMUKAN
// ===========================

else {

    const hasMultipleImages = room.images.length > 1;

    // fallback data kalau field belum ada di room-data.js
    const rating = room.rating || 4.9;
    const reviewCount = room.reviewCount || 0;
    const description = room.description ||
        `Room ${room.type} cocok buat main santai dengan fasilitas lengkap dan suasana nyaman.`;
    const status = room.status || "tersedia"; // "tersedia" | "penuh" | "booking"

    const statusMap = {
        tersedia: { class: "badge-tersedia", label: "Tersedia Sekarang" },
        penuh: { class: "badge-penuh", label: "Sedang Penuh" },
        booking: { class: "badge-booking", label: "Sedang Dibooking" }
    };
    const statusInfo = statusMap[status] || statusMap.tersedia;

    // ===========================
    // SPLIT FASILITAS
    // ===========================

    // pisahin emoji & label dari string fasilitas, misal "📺 TV 42 Inch"
    function splitFacility(facility) {
        const parts = facility.split(" ");
        const icon = parts[0];
        const label = parts.slice(1).join(" ");
        return { icon, label };
    }

    // ===========================
    // RENDER DETAIL ROOM
    // ===========================

    // membuat tampilan detail room secara otomatis
    container.innerHTML = `

    <!-- BREADCRUMB -->
    <nav class="detail-breadcrumb">
        <a href="index.html"><i class="bi bi-house-door-fill"></i> Home</a>
        <i class="bi bi-chevron-right"></i>
        <a href="rooms.html">Rooms</a>
        <i class="bi bi-chevron-right"></i>
        <span>${room.name}</span>
    </nav>

    <div class="detail-card">
        <div class="detail-grid">

            <!-- FOTO ROOM -->
            <div class="detail-media">

                <div class="detail-image-wrap">
                    <img id="mainRoomImg" src="${room.images[0]}" alt="${room.name}">
                    <span class="detail-type-badge badge-${room.type.toLowerCase()}">
                        <i class="bi bi-controller"></i> ${room.type}
                    </span>
                </div>

                <!-- thumbnail jika gambar lebih dari satu -->
                ${hasMultipleImages ? `
                <div class="detail-thumbs">
                    ${room.images.map((img, index) => `
                        <img src="${img}"
                        class="detail-thumb ${index === 0 ? "active" : ""}"
                        data-src="${img}"
                        alt="${room.name} ${index + 1}">
                    `).join("")}
                </div>
                `: ""}

            </div>


            <!-- INFORMASI ROOM -->
            <div class="detail-info">

                <div>

                    <!-- nama room -->
                    <h1 class="room-detail-name">
                        ${room.name}
                    </h1>


                    <!-- rating -->
                    <div class="room-detail-rating">
                        <i class="bi bi-star-fill"></i>
                        <span class="rating-num">${rating}</span>
                        <span class="rating-count">
                            (${reviewCount} Review)
                        </span>
                    </div>


                    <!-- harga -->
                    <h2 class="room-detail-price">
                        Rp${room.price.toLocaleString("id-ID")}
                        <span>/ jam</span>
                    </h2>


                    <!-- status -->
                    <span class="${statusInfo.class}">
                        ${statusInfo.label}
                    </span>


                    <!-- deskripsi -->
                    <p class="room-detail-desc">
                        ${description}
                    </p>


                    <hr class="detail-divider">


                    <!-- fasilitas -->
                    <h3 class="detail-section-title">
                        Fasilitas
                    </h3>


                    <div class="facility-grid">

                        ${room.facilities.map(f => {
        const { icon, label } = splitFacility(f);

        return `
                            <div class="facility-card">
                                <span class="facility-icon">
                                    ${icon}
                                </span>

                                <span class="facility-label">
                                    ${label}
                                </span>
                            </div>
                            `;

    }).join("")}

                    </div>


                    <!-- game tersedia -->
                    <h3 class="detail-section-title">
                        Game Tersedia
                    </h3>


                    <div class="detail-chip-group">

                        ${room.games.map(g => `
                            <span class="badge-item">
                                ${g}
                            </span>
                        `).join("")}

                    </div>

                </div>

                <br>
                <!-- tombol reservasi -->
                <a href="reservation.html?room=${room.id}&tipe=${room.type}" class="btn-book">
                    <i class="bi bi-calendar-check-fill"></i>
                    Pesan Sekarang
                </a>


            </div>

        </div>
    </div>


    <!-- INFO TAMBAHAN -->
    <div class="detail-extra-grid">


        <!-- jam buka -->
        <div class="extra-box">

            <div class="extra-heading">
                <i class="bi bi-clock-fill"></i>
                Jam Operasional
            </div>

            <p class="extra-sub">
                Setiap Hari
            </p>

            <p class="extra-strong">
                ${loungeInfo.jamBuka}
            </p>

        </div>


        <!-- lokasi -->
        <div class="extra-box">

            <div class="extra-heading">
                <i class="bi bi-geo-alt-fill"></i>
                Lokasi
            </div>

            <p class="extra-sub">
                ${loungeInfo.alamat}
            </p>

            <a href="${loungeInfo.mapsLink}" target="_blank" class="extra-link">
                Lihat di Google Maps
                <i class="bi bi-box-arrow-up-right"></i>
            </a>

        </div>


        <!-- aturan -->
        <div class="extra-box">

            <div class="extra-heading">
                <i class="bi bi-info-circle-fill"></i>
                Informasi Penting
            </div>

            <ul class="extra-rules">

                <li>
                    <i class="bi bi-check-circle-fill"></i>
                    Reservasi dapat dibatalkan maks. 2 jam sebelum waktu booking.
                </li>

                <li>
                    <i class="bi bi-check-circle-fill"></i>
                    Toleransi keterlambatan 15 menit dari waktu reservasi.
                </li>

                <li>
                    <i class="bi bi-check-circle-fill"></i>
                    Dilarang membawa makanan & minuman dari luar.
                </li>

                <li>
                    <i class="bi bi-check-circle-fill"></i>
                    Jagalah kebersihan room agar nyaman untuk semua.
                </li>

            </ul>

        </div>

    </div>

`;


    // menjalankan thumbnail switch jika gambar lebih dari satu
    if (hasMultipleImages) {
        initThumbSwitcher();
    }

}

// ===========================
// THUMBNAIL SWITCHER
// ===========================

function initThumbSwitcher() {

    const mainImg = document.getElementById("mainRoomImg");
    const thumbs = document.querySelectorAll(".detail-thumb");

    thumbs.forEach(thumb => {
        thumb.addEventListener("click", () => {
            mainImg.src = thumb.dataset.src;

            thumbs.forEach(t => t.classList.remove("active"));
            thumb.classList.add("active");
        });
    });
}