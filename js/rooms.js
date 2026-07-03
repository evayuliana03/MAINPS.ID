// =============================================
// DATA ROOM
// =============================================

const jamOps = [10,11,12,13,14,15,16,17,18,19,20,21,22,23,0,1];
const container = document.getElementById("roomContainer");

// =============================================
// JAM
// =============================================
function jamSekarang() {
    return new Date().getHours();
}

function jamSudahLewat(jam) {
    const now = jamSekarang();

    if (jam >= 10) {
        return now >= 10 && now > jam;
    } else {
        return now > jam && now < 10;
    }
}

// =============================================
// RESERVASI
// =============================================
function ambilReservasiHariIni() {
    const hariIni = new Date().toISOString().split("T")[0];
    const semua = JSON.parse(localStorage.getItem("daftarReservasi") || "[]");
    return semua.filter(r => r.tanggal === hariIni);
}

// =============================================
// STATUS ROOM
// =============================================
function statusRoom(roomId, reservasiHariIni) {
    const now = jamSekarang();
    const jamTerisi = {};

    reservasiHariIni
        .filter(r => r.roomId === roomId)
        .forEach(r => {
            for (let i = 0; i < r.durasi; i++) {
                const j = (r.jamMulai + i) % 24;
                jamTerisi[j] = "terisi";
            }
        });

    const jamMasihBisa = jamOps.filter(j => !jamSudahLewat(j) && !jamTerisi[j]);
    const statusNow = jamTerisi[now];

    if (jamMasihBisa.length === 0) {
        return { tipe: "penuh", teks: "Penuh Hari Ini", selesai: null };
    }

    if (statusNow === "terisi") {
        let selesai = now;
        while (jamTerisi[selesai % 24] === "terisi") selesai++;
        return { tipe: "terisi", teks: "Terisi", selesai: selesai % 24 };
    }

    const jamBooking = jamOps.find(j => !jamSudahLewat(j) && jamTerisi[j] && j !== now);

    if (jamBooking !== undefined) {
        const labelJam = jamBooking.toString().padStart(2, "0") + ":00";
        return { tipe: "booking", teks: `Booking ${labelJam}`, selesai: null };
    }

    return { tipe: "kosong", teks: "Siap dimainkan sekarang", selesai: null };
}

// =============================================
// UI HELPER
// =============================================
function badgeHTML(status) {
    const map = {
        kosong: { dot: "#10B981", label: "Tersedia" },
        booking: { dot: "#F59E0B", label: "Booking" },
        terisi: { dot: "#EF4444", label: "Terisi" },
        penuh: { dot: "#EF4444", label: "Penuh" }
    };

    const s = map[status.tipe];

    return `
        <span style="display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:800;color:${s.dot}">
            <span style="width:8px;height:8px;border-radius:50%;background:${s.dot};display:inline-block;"></span>
            ${s.label}
        </span>
    `;
}

function subTeksHTML(status) {
    if (status.tipe === "terisi" && status.selesai !== null) {
        return `<div style="font-size:13px;color:#9580B8;font-weight:600;margin-bottom:10px;">
            Selesai ${status.selesai.toString().padStart(2, "0")}.00 WIB
        </div>`;
    }

    if (status.tipe === "booking") {
        return `<div style="font-size:13px;color:#F59E0B;font-weight:600;margin-bottom:10px;">
            ${status.teks}
        </div>`;
    }

    if (status.tipe === "kosong") {
        return `<div style="font-size:13px;color:#10B981;font-weight:600;margin-bottom:10px;">
            Siap dimainkan sekarang
        </div>`;
    }

    return `<div style="font-size:13px;color:#EF4444;font-weight:600;margin-bottom:10px;">
        Tidak ada slot tersisa hari ini
    </div>`;
}

function btnHTML(room, status) {
    if (status.tipe === "penuh") {
        return `<button class="btn-book w-100" style="background:#EF4444;color:white;" disabled>
            🔴 Penuh Hari Ini
        </button>`;
    }

    const warna = {
        kosong: "#7C3AED",
        booking: "#F59E0B",
        terisi: "#EF4444"
    }[status.tipe];

    const text = {
        kosong: "🟢 Pesan Sekarang",
        booking: `🟡 ${status.teks}`,
        terisi: "🔴 Booking Sekarang"
    }[status.tipe];

    return `
        <a href="detail-room.html?id=${room.id}"
        class="btn-book w-100"
        style="background:#2563EB;color:white;display:block;text-align:center;text-decoration:none;">
        Lihat Detail Room
        </a>
    `;
}   

// =============================================
// RENDER ROOM
// =============================================
function tampilRoom(filter = "all") {
    const reservasiHariIni = ambilReservasiHariIni();
    container.innerHTML = "";

    const result = filter === "all"
        ? rooms
        : rooms.filter(r => r.type === filter);

    result.forEach(room => {
        const status = statusRoom(room.id, reservasiHariIni);

        const borderColor = {
            kosong: "#10B981",
            booking: "#F59E0B",
            terisi: "#EF4444",
            penuh: "#EF4444"
        }[status.tipe];

        container.innerHTML += `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="room-card" style="border-color:${borderColor}">
                    <img src="${room.image}" class="room-img" alt="${room.name}">
                    <div class="room-body">
                        <div class="d-flex justify-content-between align-items-start mb-1">
                            <div class="room-name">${room.name}</div>
                            ${badgeHTML(status)}
                        </div>

                        ${subTeksHTML(status)}

                        <div class="price">
                            Rp${room.price.toLocaleString("id-ID")}/Jam
                        </div>

                        <div class="facility">
                            🎮 PS5 &nbsp; ❄ AC &nbsp; 📶 WiFi &nbsp; 🛋 Sofa
                        </div>

                        <div class="mt-3">
                            ${btnHTML(room, status)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

// =============================================
// INIT
// =============================================
tampilRoom();

// =============================================
// FILTER + TRANSISI
// =============================================
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", function () {

        document.querySelectorAll(".filter-btn").forEach(b => {
            b.classList.remove("btn-main");
            b.classList.add("btn-outline-main");
        });

        this.classList.remove("btn-outline-main");
        this.classList.add("btn-main");

        container.style.opacity = "0";
        container.style.transform = "translateY(25px)";
        container.style.transition = "all 0.3s ease";

        setTimeout(() => {
            tampilRoom(this.dataset.filter);

            container.style.opacity = "1";
            container.style.transform = "translateY(0)";
        }, 300);
    });
});