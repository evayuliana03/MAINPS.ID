// =============================================
// DATA MASTER ROOM
// =============================================

// menyimpan data utama semua room yang tersedia
// data ini digunakan untuk menampilkan room di dashboard

const masterRoom = [
    { id: "reg-a", nama: "Regular A", tipe: "Reguler", harga: 10000, gambar: "img/reguler1.jpg" },
    { id: "reg-b", nama: "Regular B", tipe: "Reguler", harga: 10000, gambar: "img/reguler2.jpg" },
    { id: "vip-1", nama: "VIP 1", tipe: "VIP", harga: 20000, gambar: "img/vip1.jpg" },
    { id: "vip-2", nama: "VIP 2", tipe: "VIP", harga: 20000, gambar: "img/vip2.jpg" },
    { id: "vvip-1", nama: "VVIP 1", tipe: "VVIP", harga: 35000, gambar: "img/vvip1.jpg" },
    { id: "vvip-2", nama: "VVIP 2", tipe: "VVIP", harga: 35000, gambar: "img/vvip2.jpg" }
];

const jamOps = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0, 1];


// =============================================
// AMBIL RESERVASI
// =============================================
function ambilReservasiHariIni() {
    return JSON.parse(localStorage.getItem("daftarReservasi") || "[]");
}


// =============================================
// STATUS ROOM
// =============================================
function statusRoomSekarang(roomId, reservasiHariIni) {
    const jamSekarang = new Date().getHours();
    const resRoom = reservasiHariIni.filter(r => r.roomId === roomId);

    for (let res of resRoom) {
        let mulai = res.jamMulai;
        let selesai = (res.jamMulai + res.durasi) % 24;

        let jalan;

        if (selesai > mulai) {
            jalan = jamSekarang >= mulai && jamSekarang < selesai;
        } else {
            jalan = jamSekarang >= mulai || jamSekarang < selesai;
        }

        if (jalan) return "terisi";
        if (res.jamMulai > jamSekarang) return "booking";
    }

    return "kosong";
}


// =============================================
// SLOT JAM
// =============================================
function buatMiniSlot(roomId, reservasiHariIni) {

    const jamSekarang = new Date().getHours();
    const jamTerisi = new Set();

    reservasiHariIni.filter(r => r.roomId === roomId).forEach(r => {
        for (let i = 0; i < r.durasi; i++) {
            jamTerisi.add((r.jamMulai + i) % 24);
        }
    });

    let html = `<div class="slot-grid mt-2">`;

    jamOps.forEach(jam => {
        let kelas = jamTerisi.has(jam) ? "slot-terisi" : "slot-kosong";
        let aktif = jam === jamSekarang ? 'style="outline:2px solid #7C3AED"' : "";

        html += `
        <span class="slot-pill ${kelas}" ${aktif}>
        ${jam.toString().padStart(2, "0")}
        </span>`;
    });

    html += `</div>`;
    return html;
}


// =============================================
// Menampilkan KPI
// =============================================
function renderKPI(data) {

    document.getElementById("kpi-kosong").innerHTML =
        data.filter(r => r.status === "kosong").length;

    document.getElementById("kpi-penuh").innerHTML =
        data.filter(r => r.status === "terisi").length;

    document.getElementById("kpi-booking").innerHTML =
        data.filter(r => r.status === "booking").length;

    document.getElementById("badge-kosong").innerHTML =
        data.filter(r => r.status === "kosong").length + " Kosong";
}


// =============================================
// RENDER ROOM
// =============================================
function renderRoom(room, reservasi) {

    const grid = document.getElementById("room-grid");
    grid.innerHTML = "";

    room.forEach(r => {

        let warna = "";
        let teks = "";
        let badge = "";

        if (r.status === "kosong") {
            warna = "#D1FAE5";
            teks = "🟢 Kosong";
            badge = "badge-tersedia";
        }
        else if (r.status === "terisi") {
            warna = "#FEE2E2";
            teks = "🔴 Terisi";
            badge = "badge-penuh";
        }
        else {
            warna = "#FEF3C7";
            teks = "🟡 Booking";
            badge = "badge-booking";
        }

        grid.innerHTML += `
        <div class="col-md-6 col-lg-4 mb-3">
            <div class="room-cell" style="background:${warna};border-radius:16px;padding:16px;">

                <img src="${r.gambar}" class="room-img">

                <div class="d-flex justify-content-between">
                    <h6>${r.nama}</h6>
                    <span class="${badge}">
                    ${teks}
                    </span>
                </div>

                <small>
                ${r.tipe} - Rp${r.harga.toLocaleString("id-ID")}/jam
                </small>

                <div style="font-size:10px;font-weight:800;margin-top:10px;">
                JAM HARI INI
                </div>

                ${buatMiniSlot(r.id, reservasi)}

            </div>
        </div>`;
    });
}


// =============================================
// RENDER JADWAL + DELETE
// =============================================
function renderJadwal(reservasi) {

    const list = document.getElementById("jadwal-list");
    list.innerHTML = "";

    if (reservasi.length === 0) {
        list.innerHTML =
            `<div class="text-center py-4" style="color:#9580B8;font-size:13px;">
        📭 Belum ada jadwal hari ini
        </div>`;
        return;
    }


    reservasi.sort((a, b) => a.jamMulai - b.jamMulai)
        .forEach((item, index) => {

            let mulai = item.jamMulai.toString().padStart(2, "0") + ":00";

            let selesai = ((item.jamMulai + item.durasi) % 24)
                .toString()
                .padStart(2, "0") + ":00";


            list.innerHTML += `
        <div class="schedule-item">

            <div class="schedule-info">
                <div class="sched-room">
                🎮 ${item.roomNama || item.tipe}
                </div>

                <div class="sched-customer">
                👤 ${item.nama}
                </div>

                <div class="sched-time">
                🕐 ${mulai} - ${selesai} WIB
                </div>
            </div>

            <button class="btn-delete-jadwal"
            onclick="hapusReservasi(${index})">
            🗑
            </button>

        </div>`;
        });
}


// =============================================
// HAPUS RESERVASI
// =============================================
function hapusReservasi(index) {

    let data = JSON.parse(
        localStorage.getItem("daftarReservasi") || "[]"
    );

    if (confirm("Hapus jadwal ini?")) {
        data.splice(index, 1);

        localStorage.setItem(
            "daftarReservasi",
            JSON.stringify(data)
        );

        renderDashboard();
    }
}


// =============================================
// MAIN DASHBOARD
// =============================================
function renderDashboard() {

    const reservasi = ambilReservasiHariIni();

    const roomStatus = masterRoom.map(room => {
        return {
            ...room,
            status: statusRoomSekarang(room.id, reservasi)
        }
    });


    renderKPI(roomStatus);
    renderRoom(roomStatus, reservasi);
    renderJadwal(reservasi);
}

renderDashboard();