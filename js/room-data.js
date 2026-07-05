// =============================================
// DATA ROOM
// =============================================

// menyimpan seluruh data room MAINPS.ID
// digunakan untuk halaman rooms dan detail room

const rooms = [
    {
        id: "reg-a",
        name: "Regular A",
        type: "Regular",
        price: 10000,
        rating: 4.7,
        reviewCount: 84,
        description: "Room Regular yang pas buat main santai berdua atau bertiga. AC dingin, TV gede, dan sofa empuk bikin betah main lama.",
        status: "tersedia",
        image: "img/reguler1.jpg",
        images: ["img/reguler1.jpg"],
        facilities: ["📺 TV 42 Inch", "❄ AC", "📶 WiFi", "🎮 2 Stick PS4", "🛋 Sofa"],
        games: ["FC 26", "Tekken 8", "GTA V", "Spider-Man 2"]
    },
    {
        id: "reg-b",
        name: "Regular B",
        type: "Regular",
        price: 10000,
        rating: 4.8,
        reviewCount: 126,
        description: "Room Regular cocok untuk bermain 2-4 orang dengan suasana nyaman, AC dingin, WiFi kencang, dan fasilitas lengkap untuk pengalaman bermain terbaik.",
        status: "tersedia",
        image: "img/reguler2.jpg",
        images: ["img/reguler2.jpg"],
        facilities: ["📺 TV 40 Inch", "❄ AC", "📶 WiFi", "🎮 2 Stick PS4", "🛋 Sofa"],
        games: ["FC 26", "Mortal Kombat 1", "WWE 2K25", "Crash Team Racing"]
    },
    {
        id: "vip-1",
        name: "VIP 1",
        type: "VIP",
        price: 20000,
        rating: 4.9,
        reviewCount: 158,
        description: "Room VIP dengan Smart TV 55 inch dan sofa premium, cocok buat kamu yang main rame-rame bareng temen dengan kenyamanan ekstra.",
        status: "tersedia",
        image: "img/vip1.jpg",
        images: ["img/vip1.jpg"],
        facilities: ["📺 Smart TV 55 Inch", "❄ AC", "📶 WiFi", "🎮 4 Stick PS4", "🛋 Premium Sofa"],
        games: ["FC 26", "NBA 2K26", "GTA V", "Black Myth Wukong"]
    },
    {
        id: "vip-2",
        name: "VIP 2",
        type: "VIP",
        price: 20000,
        rating: 4.9,
        reviewCount: 143,
        description: "Room VIP dengan konsol PS5 dan layar 55 inch, pas buat kamu yang pengen main game-game AAA dengan visual maksimal.",
        status: "booking",
        image: "img/vip2.jpg",
        images: ["img/vip2.jpg"],
        facilities: ["📺 Smart TV 55 Inch", "❄ AC", "📶 WiFi", "🎮 4 Stick PS5", "🛋 Premium Sofa"],
        games: ["Tekken 8", "Elden Ring", "FC 26", "Spider-Man 2"]
    },
    {
        id: "vvip-1",
        name: "VVIP 1",
        type: "VVIP",
        price: 35000,
        rating: 5.0,
        reviewCount: 97,
        description: "Room VVIP dengan layar 75 inch dan PS5 Pro, dilengkapi sofa mewah untuk pengalaman gaming paling premium di MAINPS.ID.",
        status: "tersedia",
        image: "img/vvip1.jpg",
        images: ["img/vvip1.jpg"],
        facilities: ["📺 TV 75 Inch", "❄ AC", "📶 WiFi", "🎮 PS5 Pro", "🛋 Luxury Sofa"],
        games: ["All Games", "VR Mode", "FC 26", "Tekken 8"]
    },
    {
        id: "vvip-2",
        name: "VVIP 2",
        type: "VVIP",
        price: 35000,
        rating: 4.9,
        reviewCount: 112,
        description: "Room VVIP terlengkap dengan fitur karaoke, layar 75 inch, dan PS5 Pro — pilihan terbaik buat merayakan momen spesial bareng temen-temen.",
        status: "penuh",
        image: "img/vvip2.jpg",
        images: ["img/vvip2.jpg"],
        facilities: ["📺 TV 75 Inch", "❄ AC", "📶 WiFi", "🎮 PS5 Pro", "🛋 Luxury Sofa", "🎤 Karaoke"],
        games: ["All Games", "Resident Evil 4", "FC 26", "God of War"]
    }
];