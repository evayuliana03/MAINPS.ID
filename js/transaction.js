// =============================================
// AMBIL DATA RESERVASI TERAKHIR
// =============================================
const data = JSON.parse(localStorage.getItem("reservasiTerakhir"));

if (!data) {
    window.location.href = "reservation.html";
}

// =============================================
// METODE PEMBAYARAN (dengan detail instruksi)
// =============================================
const metodeBayar = [
    {
        id    : "qris",
        nama  : "QRIS",
        sub   : "Scan QR — semua e-wallet & m-banking",
        emoji : "📲",
        detail: `
        <div style="text-align:center;padding:16px 0;">
            <div style="
                display:inline-block;
                padding:12px;
                background:#fff;
                border:3px solid #0D2350;
                border-radius:16px;
                margin-bottom:12px;
            ">
                <img src="img/qris.jpeg" alt="QRIS" style="
                    width:180px;
                    height:auto;
                    display:block;
                    border-radius:8px;
                ">
            </div>

            <div style="
                font-size:13px;
                font-weight:800;
                color:#1E1033;
                margin-bottom:4px;
            ">
                MAINPS.ID — PlayStation Lounge
            </div>

            <div style="
                font-size:12px;
                color:#9580B8;
            ">
                Scan dengan GoPay · OVO · Dana · ShopeePay
                <br>
                atau m-Banking manapun
            </div>

            <div style="
                margin-top:12px;
                padding:8px 16px;
                background:#EDE9FE;
                border-radius:8px;
                font-size:12px;
                color:#7C3AED;
                font-weight:700;
            ">
                ⚠️ Nominal sesuai Total Bayar di ringkasan
            </div>
        </div>
    `
    },
    {
        id    : "transfer",
        nama  : "Transfer Bank",
        sub   : "BCA · BRI · Mandiri · BNI",
        emoji : "🏦",
        detail: `
            <div style="padding:4px 0;">
                <div style="font-size:12px;font-weight:800;color:#9580B8;
                            font-family:'Space Mono',monospace;letter-spacing:.1em;margin-bottom:12px;">
                    PILIH BANK TUJUAN
                </div>
                ${[
                    { bank:"BCA",rek:"007355522468",   an:"MAINPS ID LOUNGE" },
                    { bank:"BRI",rek:"3209 0100 5910 500",   an:"MAINPS ID LOUNGE" },
                    { bank:"BTN",rek:"8001610044698",   an:"MAINPS ID LOUNGE" },
                    { bank:"Dana",rek:"085893129216",   an:"MAINPS ID LOUNGE" }
                ].map(b => `
                    <div onclick="pilihdRek(this)" style="
                        display:flex;align-items:center;gap:12px;
                        padding:12px 14px;margin-bottom:8px;
                        border:2px solid #DDD6F3;border-radius:12px;
                        cursor:pointer;transition:.2s;background:#F7F3FF;">
                        <div style="width:48px;height:32px;background:#1E1033;border-radius:6px;
                                    display:flex;align-items:center;justify-content:center;
                                    color:#A78BFA;font-weight:900;font-size:11px;">${b.bank}</div>
                        <div>
                            <div style="font-weight:800;font-size:14px;color:#1E1033;">${b.rek}</div>
                            <div style="font-size:11px;color:#9580B8;">a.n. ${b.an}</div>
                        </div>
                        <div style="margin-left:auto;font-size:18px;">📋</div>
                    </div>
                `).join("")}
                <div style="margin-top:8px;padding:10px 14px;background:#FEF3C7;
                            border-radius:10px;font-size:12px;color:#92400E;">
                    ⚠️ Transfer sesuai nominal total. Booking dikonfirmasi setelah pembayaran diterima.
                </div>
            </div>
        `
    },
    {
        id    : "cash",
        nama  : "Cash di Kasir",
        sub   : "Bayar langsung saat tiba di lounge",
        emoji : "💵",
        detail: `
            <div style="text-align:center;padding:16px 0;">
                <div style="font-size:48px;margin-bottom:12px;">💵</div>
                <div style="font-weight:900;font-size:16px;color:#1E1033;margin-bottom:8px;">
                    Bayar Cash di Kasir
                </div>
                <div style="font-size:13px;color:#9580B8;margin-bottom:16px;">
                    Tunjukkan kode booking ke kasir saat tiba.<br>
                    Bayar sesuai total tagihan.
                </div>
                <div style="padding:12px 16px;background:#D1FAE5;border-radius:10px;
                            font-size:13px;color:#065F46;font-weight:700;">
                    ✅ Booking akan dikunci otomatis.<br>
                    Harap tiba 10 menit sebelum jam main.
                </div>
            </div>
        `
    }
];

// Variabel global untuk bayar yang dipilih
let metodeTerpilih = null;

// =============================================
// TAMPILKAN RINGKASAN (summary kanan)
// =============================================
document.getElementById("sum-nama").innerHTML    = data.nama;

// Format tanggal: "2026-06-22" → "22 Juni 2026"
const tgl = new Date(data.tanggal + "T00:00:00");
const namaHari = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const namaBulan = ["Januari","Februari","Maret","April","Mei","Juni",
                   "Juli","Agustus","September","Oktober","November","Desember"];
document.getElementById("sum-tanggal").innerHTML =
    namaHari[tgl.getDay()] + ", " +
    tgl.getDate() + " " + namaBulan[tgl.getMonth()] + " " + tgl.getFullYear();

document.getElementById("order-room-nama").innerHTML  = data.roomNama || data.tipe;
document.getElementById("order-room-harga").innerHTML =
    "Rp" + data.harga.toLocaleString("id-ID") + "/Jam";

// Jam mulai
const jamMulaiLabel = data.jamMulai.toString().padStart(2,"0") + ":00 WIB";
document.getElementById("sum-jam-mulai").innerHTML = jamMulaiLabel;

// Emoji tipe room
let emoji = "🎮";
if (data.tipe === "VIP")  emoji = "⭐";
if (data.tipe === "VVIP") emoji = "👑";
document.getElementById("order-room-emoji").innerHTML = emoji;

// =============================================
// RENDER KARTU DURASI
// =============================================
let durasiDipilih = data.durasi;
const durGrid = document.getElementById("dur-grid");

for (let i = 1; i <= 4; i++) {
    const selected = (i === durasiDipilih) ? "selected" : "";
    durGrid.innerHTML += `
        <div class="dur-item ${selected}" data-jam="${i}">
            <div class="dur-jam">${i}</div>
            <div class="dur-price-label">JAM</div>
        </div>
    `;
}

// =============================================
// RENDER SNACK
// =============================================
const snackData = [
    { nama:"Popcorn",    emoji:"🍿", harga:5000  },
    { nama:"Kentang",    emoji:"🍟", harga:7000  },
    { nama:"Soft Drink", emoji:"🥤", harga:3000  },
    { nama:"Cokelat",    emoji:"🍫", harga:4000  },
    { nama:"Air Mineral",emoji:"💧", harga:2000  }
];

const snackGrid = document.getElementById("snack-grid");
snackData.forEach(snack => {
    snackGrid.innerHTML += `
        <div class="snack-card" data-harga="${snack.harga}">
            <div class="snack-check-icon">✓</div>
            <span class="snack-emoji">${snack.emoji}</span>
            <div class="snack-name">${snack.nama}</div>
            <div class="snack-price">Rp${snack.harga.toLocaleString("id-ID")}</div>
        </div>
    `;
});

// =============================================
// RENDER METODE PEMBAYARAN
// =============================================
const payOpts = document.getElementById("pay-opts");

metodeBayar.forEach(m => {
    payOpts.innerHTML += `
        <div class="pay-option" data-id="${m.id}" onclick="pilihMetode(this)">
            <div class="pay-emoji">${m.emoji}</div>
            <div>
                <div class="pay-name">${m.nama}</div>
                <div class="pay-sub">${m.sub}</div>
            </div>
            <div class="pay-check">✓</div>
        </div>
        <!-- Detail instruksi, tersembunyi dulu -->
        <div id="detail-${m.id}" style="display:none;
            margin:-8px 0 12px;padding:16px;
            background:#F7F3FF;border:1.5px dashed #A78BFA;
            border-radius:0 0 14px 14px;">
            ${m.detail}
        </div>
    `;
});

// =============================================
// FUNGSI: Pilih metode bayar → tampilkan detail
// =============================================
function pilihMetode(el) {
    // Reset semua
    document.querySelectorAll(".pay-option").forEach(x => x.classList.remove("selected"));
    document.querySelectorAll("[id^='detail-']").forEach(x => x.style.display = "none");

    // Aktifkan yang diklik
    el.classList.add("selected");
    metodeTerpilih = el.dataset.id;

    // Tampilkan panel detail instruksi
    document.getElementById("detail-" + metodeTerpilih).style.display = "block";

    // Aktifkan tombol konfirmasi
    const btn = document.getElementById("btn-konfirmasi");
    btn.disabled = false;
    btn.innerHTML = "✅ Konfirmasi Pesanan";
}

// =============================================
// FUNGSI: Klik rekening bank → copy ke clipboard
// =============================================
function pilihdRek(el) {
    const norek = el.querySelector("div > div:first-child").innerText;
    navigator.clipboard.writeText(norek).then(() => {
        el.querySelector("div:last-child").innerHTML = "✅";
        setTimeout(() => el.querySelector("div:last-child").innerHTML = "📋", 2000);
    }).catch(() => {
        alert("No. Rek: " + norek);
    });
}

// =============================================
// HITUNG TOTAL
// =============================================
function hitungTotal() {
    let totalSnack = 0;
    const snackDipilih = [];

    document.querySelectorAll(".snack-card.selected").forEach(card => {
        const harga = Number(card.dataset.harga);
        totalSnack += harga;
        snackDipilih.push({
            nama : card.querySelector(".snack-name").innerText,
            harga: harga
        });
    });

    const hargaRoom  = data.harga * durasiDipilih;
    const totalAkhir = hargaRoom + totalSnack;

    // Jam selesai
    const selesaiAngka = (data.jamMulai + durasiDipilih) % 24;
    const selesaiLabel = selesaiAngka.toString().padStart(2,"0") + ":00 WIB";

    // Update summary
    document.getElementById("sum-durasi").innerHTML      = durasiDipilih + " Jam";
    document.getElementById("sum-jam-selesai").innerHTML = selesaiLabel;
    document.getElementById("sum-harga-room").innerHTML  = "Rp" + hargaRoom.toLocaleString("id-ID");
    document.getElementById("sum-total").innerHTML       = "Rp" + totalAkhir.toLocaleString("id-ID");

    // Tampilkan baris snack di summary
    const snackArea = document.getElementById("sum-snack-area");
    snackArea.innerHTML = "";
    snackDipilih.forEach(s => {
        snackArea.innerHTML += `
            <div class="order-line">
                <span class="order-line-key">+ ${s.nama}</span>
                <span class="order-line-val">Rp${s.harga.toLocaleString("id-ID")}</span>
            </div>
        `;
    });
}

hitungTotal();

// =============================================
// EVENT: Klik kartu durasi
// =============================================
document.querySelectorAll(".dur-item").forEach(item => {
    item.onclick = function () {
        document.querySelectorAll(".dur-item").forEach(x => x.classList.remove("selected"));
        this.classList.add("selected");
        durasiDipilih = Number(this.dataset.jam);
        hitungTotal();
    };
});

// =============================================
// EVENT: Klik kartu snack
// =============================================
document.querySelectorAll(".snack-card").forEach(card => {
    card.onclick = function () {
        this.classList.toggle("selected");
        hitungTotal();
    };
});

// =============================================
// EVENT: Tombol konfirmasi → modal sukses
// =============================================
document.getElementById("btn-konfirmasi").onclick = function () {
    if (!metodeTerpilih) return;

    // Isi modal
    document.getElementById("modal-nama").innerHTML    = data.nama;
    document.getElementById("modal-room").innerHTML    = data.roomNama || data.tipe;
    document.getElementById("modal-tanggal").innerHTML = document.getElementById("sum-tanggal").innerHTML;
    document.getElementById("modal-total").innerHTML   = document.getElementById("sum-total").innerHTML;
    document.getElementById("modal-booking-code").innerHTML = data.kodebooking;

    // Tambahkan info metode bayar di modal
    const m = metodeBayar.find(x => x.id === metodeTerpilih);
    if (m) {
        const elMetode = document.getElementById("modal-metode");
        if (elMetode) elMetode.innerHTML = m.emoji + " " + m.nama;
    }

    new bootstrap.Modal(document.getElementById("modal-sukses")).show();
};
