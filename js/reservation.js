// =============================================
// DATA ROOM
// =============================================
const dataRoom = [
    { id: "reg-a",  nama: "Regular A", tipe: "Regular", harga: 10000 },
    { id: "reg-b",  nama: "Regular B", tipe: "Regular", harga: 10000 },
    { id: "vip-1",  nama: "VIP 1",     tipe: "VIP",     harga: 20000 },
    { id: "vip-2",  nama: "VIP 2",     tipe: "VIP",     harga: 20000 },
    { id: "vvip-1", nama: "VVIP 1",    tipe: "VVIP",    harga: 35000 },
    { id: "vvip-2", nama: "VVIP 2",    tipe: "VVIP",    harga: 35000 }
];

const jamOperasional = [10,11,12,13,14,15,16,17,18,19,20,21,22,23,0,1];

// =============================================
// AMBIL RESERVASI
// =============================================
function ambilSemuaReservasi() {
    return JSON.parse(localStorage.getItem("daftarReservasi") || "[]");
}

// =============================================
// CEK BENTROK RESERVASI
// =============================================
function jamSudahTerisi(roomId, tanggal, jamMulai, durasi) {
    const semuaReservasi = ambilSemuaReservasi();
    for (let res of semuaReservasi) {
        if (res.roomId !== roomId || res.tanggal !== tanggal) continue;
        for (let i = 0; i < res.durasi; i++) {
            let jamPakai = (res.jamMulai + i) % 24;
            for (let j = 0; j < durasi; j++) {
                if (jamPakai === (jamMulai + j) % 24) return true;
            }
        }
    }
    return false;
}

// =============================================
// CEK JAM SUDAH LEWAT (real-time, khusus hari ini)
// =============================================
function jamSudahLewat(jam, tanggal) {
    const hariIni = new Date().toISOString().split("T")[0];
    if (tanggal !== hariIni) return false; // hari lain bebas
    const now = new Date().getHours();
    if (jam >= 10) return now > jam;
    return now > jam && now < 10;
}

// =============================================
// AMBIL ELEMEN
// =============================================
const elNama       = document.getElementById("nama");
const elTanggal    = document.getElementById("tanggal");
const elRoom       = document.getElementById("room");
const elDurasi     = document.getElementById("duration");
const elJamMulai   = document.getElementById("jamMulai");
const elJamSelesai = document.getElementById("jamSelesai");
const elTotal      = document.getElementById("total");
const form         = document.getElementById("reservationForm");

// =============================================
// ISI DROPDOWN ROOM SPESIFIK
// =============================================
function isiDropdownRoom() {
    const tipe = elRoom.value;
    const elRoomSpesifik = document.getElementById("roomSpesifik");
    elRoomSpesifik.innerHTML = "";

    dataRoom.filter(r => r.tipe === tipe).forEach(r => {
        elRoomSpesifik.innerHTML += `<option value="${r.id}">${r.nama}</option>`;
    });

    perbaruiSlotJam();
}

// =============================================
// PERBARUI SLOT JAM — jam lewat & terisi dikunci
// =============================================
function perbaruiSlotJam() {
    const tanggal = elTanggal.value;
    const roomId  = document.getElementById("roomSpesifik").value;
    const durasi  = Number(elDurasi.value);

    elJamMulai.innerHTML = "";

    for (let jam of jamOperasional) {
        const lewat   = jamSudahLewat(jam, tanggal);
        const terisi  = tanggal && roomId ? jamSudahTerisi(roomId, tanggal, jam, durasi) : false;
        const blocked = lewat || terisi;

        const labelJam = jam.toString().padStart(2, "0") + ":00 WIB";
        let labelTambahan = "";
        if (lewat)  labelTambahan = " (Sudah Lewat)";
        else if (terisi) labelTambahan = " (Terisi)";

        elJamMulai.innerHTML += `
            <option value="${jam}" ${blocked ? "disabled" : ""}>
                ${labelJam}${labelTambahan}
            </option>
        `;
    }

    // Pastikan pilihan pertama yang aktif terpilih
    const firstEnabled = elJamMulai.querySelector("option:not([disabled])");
    if (firstEnabled) firstEnabled.selected = true;

    hitungTotal();
}

// =============================================
// HITUNG TOTAL & JAM SELESAI
// =============================================
function hitungTotal() {
    const tipe   = elRoom.value;
    const durasi = Number(elDurasi.value);
    const roomData = dataRoom.find(r => r.tipe === tipe);
    const harga    = roomData ? roomData.harga : 0;
    const total    = harga * durasi;
    elTotal.innerHTML = "Rp" + total.toLocaleString("id-ID");

    const elTerpilih = elJamMulai.options[elJamMulai.selectedIndex];
    if (!elTerpilih) return;

    const jamMulaiAngka = Number(elTerpilih.value);
    let jamSelesaiAngka = (jamMulaiAngka + durasi) % 24;

    if (jamSelesaiAngka > 2 && jamSelesaiAngka < 10) {
        alert("Jam melebihi batas operasional (02:00 WIB). Durasi otomatis disesuaikan.");
        elDurasi.value = 1;
        jamSelesaiAngka = (jamMulaiAngka + 1) % 24;
        elTotal.innerHTML = "Rp" + harga.toLocaleString("id-ID");
    }

    elJamSelesai.value = jamSelesaiAngka.toString().padStart(2, "0") + ":00 WIB";
}

// =============================================
// EVENT LISTENERS
// =============================================
elRoom.addEventListener("change", isiDropdownRoom);
document.getElementById("roomSpesifik").addEventListener("change", perbaruiSlotJam);
elDurasi.addEventListener("change", perbaruiSlotJam);
elTanggal.addEventListener("change", perbaruiSlotJam);
elJamMulai.addEventListener("change", hitungTotal);

// =============================================
// SUBMIT FORM
// =============================================
form.addEventListener("submit", function (e) {
    e.preventDefault();
    let valid = true;

    if (elNama.value.trim() === "") {
        elNama.classList.add("is-invalid"); valid = false;
    } else {
        elNama.classList.remove("is-invalid");
    }

    if (elTanggal.value === "") {
        elTanggal.classList.add("is-invalid"); valid = false;
    } else {
        elTanggal.classList.remove("is-invalid");
    }

    if (!valid) return;

    const tipe    = elRoom.value;
    const roomId  = document.getElementById("roomSpesifik").value;
    const roomData= dataRoom.find(r => r.id === roomId);
    const durasi  = Number(elDurasi.value);
    const jamMulaiAngka = Number(elJamMulai.options[elJamMulai.selectedIndex].value);

    const reservasiBaru = {
        nama      : elNama.value,
        tanggal   : elTanggal.value,
        tipe      : tipe,
        roomId    : roomId,
        roomNama  : roomData ? roomData.nama : tipe,
        harga     : roomData ? roomData.harga : 0,
        durasi    : durasi,
        jamMulai  : jamMulaiAngka,
        jamSelesai: elJamSelesai.value,
        total     : elTotal.innerHTML,
        kodebooking: "MPS-" + Math.floor(100000 + Math.random() * 900000)
    };

    const semuaReservasi = ambilSemuaReservasi();
    semuaReservasi.push(reservasiBaru);
    localStorage.setItem("daftarReservasi", JSON.stringify(semuaReservasi));
    localStorage.setItem("reservasiTerakhir", JSON.stringify(reservasiBaru));

    window.location.href = "transaction.html";
});

// =============================================
// INISIALISASI + PRE-SELECT dari URL params
// =============================================
const hariIni = new Date().toISOString().split("T")[0];
elTanggal.min   = hariIni;
elTanggal.value = hariIni;

// Baca URL parameter ?room=vip-1&tipe=VIP (dari tombol rooms.html)
const params = new URLSearchParams(window.location.search);
const paramTipe = params.get("tipe");
const paramRoom = params.get("room");

if (paramTipe) {
    // Set dropdown tipe
    elRoom.value = paramTipe;
}

// Isi dropdown room spesifik dulu
isiDropdownRoom();

if (paramRoom) {
    // Set room spesifik setelah dropdown terisi
    const elRoomSpesifik = document.getElementById("roomSpesifik");
    elRoomSpesifik.value = paramRoom;
    perbaruiSlotJam();
}
