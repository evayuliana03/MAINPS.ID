// =============================================
// DATA MASTER ROOM
// =============================================
const masterRoom = [
    { id: "reg-a",  nama: "RegularA", tipe: "Reguler", harga: 10000, gambar: "img/reguler1.jpg" },
    { id: "reg-b",  nama: "Regular B", tipe: "Reguler", harga: 10000, gambar: "img/reguler2.jpg" },
    { id: "vip-1",  nama: "VIP 1",     tipe: "VIP",     harga: 20000, gambar: "img/vip1.jpg"     },
    { id: "vip-2",  nama: "VIP 2",     tipe: "VIP",     harga: 20000, gambar: "img/vip2.jpg"     },
    { id: "vvip-1", nama: "VVIP 1",    tipe: "VVIP",    harga: 35000, gambar: "img/vvip1.jpg"    },
    { id: "vvip-2", nama: "VVIP 2",    tipe: "VVIP",    harga: 35000, gambar: "img/vvip2.jpg"    }
];

const jamOps = [10,11,12,13,14,15,16,17,18,19,20,21,22,23,0,1];


function ambilReservasiHariIni() {
    const hariIni = new Date().toISOString().split("T")[0];
    const semua   = JSON.parse(localStorage.getItem("daftarReservasi") || "[]");
    return semua.filter(r => r.tanggal === hariIni);
}

// status
function statusRoomSekarang(roomId, reservasiHariIni) {
    const jamSekarang = new Date().getHours();

    const resRoom = reservasiHariIni.filter(r => r.roomId === roomId);

    for (let res of resRoom) {
        const mulai   = res.jamMulai;
        const selesai = (res.jamMulai + res.durasi) % 24;

        // Cek apakah jam sekarang masuk dalam range slot reservasi
        let sedangBerjalan;
        if (selesai > mulai) {
            // Contoh normal: mulai=14, selesai=16 → cek 14 ≤ jam < 16
            sedangBerjalan = (jamSekarang >= mulai && jamSekarang < selesai);
        } else {
            // Melewati tengah malam: mulai=23, selesai=1 → cek jam ≥ 23 ATAU jam < 1
            sedangBerjalan = (jamSekarang >= mulai || jamSekarang < selesai);
        }

        if (sedangBerjalan) return "terisi"; 

        // Reservasi belum mulai (booking ke depan)
        if (res.jamMulai > jamSekarang) return "booking";
    }

    return "kosong";
}

// =============================================
// BUAT MINI SLOT JAM untuk dashboard room cell
// =============================================
function buatMiniSlot(roomId, reservasiHariIni) {
    const jamSekarang = new Date().getHours();

    // Kumpulkan jam yang terisi
    const jamTerisi = new Set();
    reservasiHariIni
        .filter(r => r.roomId === roomId)
        .forEach(r => {
            for (let i = 0; i < r.durasi; i++) {
                jamTerisi.add((r.jamMulai + i) % 24);
            }
        });

    let html = '<div class="slot-grid mt-2">';
    jamOps.forEach(jam => {
        const label  = jam.toString().padStart(2, "0");
        const terisi = jamTerisi.has(jam);
        const aktif  = jam === jamSekarang ? 'style="outline:2px solid #7C3AED;outline-offset:1px;"' : '';
        const kelas  = terisi ? "slot-terisi" : "slot-kosong";
        html += `<span class="slot-pill ${kelas}" ${aktif} title="${jam.toString().padStart(2,"0")}:00">${label}</span>`;
    });
    html += "</div>";
    return html;
}

// =============================================
// RENDER KPI
// =============================================
function renderKPI(roomsDenganStatus) {
    const kosong  = roomsDenganStatus.filter(r => r.status === "kosong").length;
    const terisi  = roomsDenganStatus.filter(r => r.status === "terisi").length;
    const booking = roomsDenganStatus.filter(r => r.status === "booking").length;

    document.getElementById("kpi-kosong").innerHTML  = kosong;
    document.getElementById("kpi-penuh").innerHTML   = terisi;
    document.getElementById("kpi-booking").innerHTML = booking;
    document.getElementById("badge-kosong").innerHTML = kosong + " Kosong";
}

// =============================================
// RENDER ROOM GRID
// =============================================
function renderRoom(roomsDenganStatus, reservasiHariIni) {
    const grid = document.getElementById("room-grid");
    grid.innerHTML = "";

    roomsDenganStatus.forEach(room => {
        let warna, teks, badgeClass;

        if (room.status === "kosong") {
            warna = "#D1FAE5"; teks = "🟢 Kosong";   badgeClass = "badge-tersedia";
        } else if (room.status === "terisi") {
            warna = "#FEE2E2"; teks = "🔴 Terisi";   badgeClass = "badge-penuh";
        } else {
            warna = "#FEF3C7"; teks = "🟡 Booking";  badgeClass = "badge-booking";
        }

        const miniSlot = buatMiniSlot(room.id, reservasiHariIni);

        grid.innerHTML += `
            <div class="col-md-6 col-lg-4 mb-3">
                <div class="room-cell" style="background:${warna}; border-radius:16px; padding:16px;">
                    <img src="${room.gambar}" class="room-img"
                         style="width:100%;height:100px;object-fit:cover;border-radius:10px;margin-bottom:10px;"
                         alt="${room.nama}">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <h6 style="margin:0;font-weight:900;">${room.nama}</h6>
                        <span class="${badgeClass}" style="font-size:11px;">${teks}</span>
                    </div>
                    <small style="color:#666;">${room.tipe} &nbsp;·&nbsp; Rp${room.harga.toLocaleString("id-ID")}/jam</small>
                    ${room.status !== "kosong"
                        ? `<div style="font-size:11px;color:#555;margin-top:4px;">Selesai: ${room.selesaiLabel}</div>`
                        : ""}
                    <!-- Mini slot jam -->
                    <div style="font-size:10px;font-weight:800;color:#666;
                                font-family:'Space Mono',monospace;margin-top:10px;">
                        JAM HARI INI
                    </div>
                    ${miniSlot}
                </div>
            </div>
        `;
    });
}

// =============================================
// RENDER JADWAL HARI INI
// =============================================
function renderJadwal(reservasiHariIni) {
    const list = document.getElementById("jadwal-list");
    list.innerHTML = "";

    if (reservasiHariIni.length === 0) {
        list.innerHTML = `
            <div class="text-center py-4" style="color:#9580B8;font-size:13px;">
                📭 Belum ada jadwal hari ini
            </div>
        `;
        return;
    }

    // Urutkan dari jam mulai terkecil
    const terurut = [...reservasiHariIni].sort((a, b) => a.jamMulai - b.jamMulai);
    const jamSekarang = new Date().getHours();

    terurut.forEach(item => {
        const mulaiLabel   = item.jamMulai.toString().padStart(2,"0") + ":00";
        const selesaiAngka = (item.jamMulai + item.durasi) % 24;
        const selesaiLabel = selesaiAngka.toString().padStart(2,"0") + ":00";

        // Tandai yang sedang berjalan sekarang
        const sedangBerjalan = (item.jamMulai <= jamSekarang && selesaiAngka > jamSekarang);
        const aktifStyle     = sedangBerjalan
            ? "border-left:3px solid #7C3AED;padding-left:8px;"
            : "";

        list.innerHTML += `
            <div class="schedule-item" style="${aktifStyle}">
                <div class="sched-room">${item.roomNama || item.tipe}</div>
                <div class="sched-customer">👤 ${item.nama}</div>
                <div class="sched-time">🕐 ${mulaiLabel} – ${selesaiLabel} WIB</div>
                ${sedangBerjalan ? `<span class="badge-tersedia" style="font-size:10px;">● Sedang Berjalan</span>` : ""}
            </div>
        `;
    });
}

// =============================================
// FUNGSI UTAMA
// =============================================
function renderDashboard() {
    const reservasiHariIni = ambilReservasiHariIni();

    const roomsDenganStatus = masterRoom.map(room => {
        const status    = statusRoomSekarang(room.id, reservasiHariIni);
        const resAktif  = reservasiHariIni.find(r => r.roomId === room.id);
        let selesaiLabel = "-";
        if (resAktif) {
            const angka  = (resAktif.jamMulai + resAktif.durasi) % 24;
            selesaiLabel = angka.toString().padStart(2,"0") + ":00 WIB";
        }
        return { ...room, status, selesaiLabel };
    });

    renderKPI(roomsDenganStatus);
    renderRoom(roomsDenganStatus, reservasiHariIni);
    renderJadwal(reservasiHariIni);
}

renderDashboard();
