const params = new URLSearchParams(window.location.search);
const roomId = params.get("id");

const container = document.getElementById("detailContainer");

if (!container) {
    console.error("detailContainer tidak ditemukan");
}

const room = rooms.find(r => r.id === roomId);

if (!room) {
    container.innerHTML = `
        <div class="detail-card text-center">
            <h2 style="font-weight:900;color:#EF4444;">Room Tidak Ditemukan</h2>
            <p>Data room dengan ID <b>${roomId}</b> tidak ada.</p>

            <a href="rooms.html" class="btn-book">
                Kembali ke Rooms
            </a>
        </div>
    `;
} else {
    container.innerHTML = `
        <div class="detail-card">

            <!-- SLIDER FOTO -->
            <div id="carouselExample" class="carousel slide mb-4">
                <div class="carousel-inner">
                    ${room.images.map((img, index) => `
                        <div class="carousel-item ${index === 0 ? "active" : ""}">
                            <img src="${img}" class="room-img" alt="${room.name}">
                        </div>
                    `).join("")}
                </div>

                <button class="carousel-control-prev" type="button"
                    data-bs-target="#carouselExample"
                    data-bs-slide="prev">
                    <span class="carousel-control-prev-icon"></span>
                </button>

                <button class="carousel-control-next" type="button"
                    data-bs-target="#carouselExample"
                    data-bs-slide="next">
                    <span class="carousel-control-next-icon"></span>
                </button>
            </div>

            <!-- NAMA ROOM -->
            <h1 style="font-weight:900;">
                ${room.name}
            </h1>

            <!-- HARGA -->
            <h4 style="color:#7C3AED;font-weight:800;">
                Rp${room.price.toLocaleString("id-ID")} / Jam
            </h4>

            <hr>

            <!-- FASILITAS -->
            <h3 style="font-weight:900;">Fasilitas</h3>

            <div>
                ${room.facilities.map(f => `
                    <span class="badge-item">${f}</span>
                `).join("")}
            </div>

            <hr>

            <!-- GAME -->
            <h3 style="font-weight:900;">Game Tersedia</h3>

            <div>
                ${room.games.map(g => `
                    <span class="badge-item">${g}</span>
                `).join("")}
            </div>

            <!-- BUTTON -->
            <a href="reservation.html?room=${room.id}&tipe=${room.type}"
               class="btn-book">
                Pesan Sekarang
            </a>

        </div>
    `;
}