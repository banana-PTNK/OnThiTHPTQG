// js/firebase-config.js
// Sử dụng thư viện Firebase Compat để không phá vỡ cấu trúc biến toàn cục hiện tại

const firebaseConfig = {
    apiKey: "AIzaSyAfz56nAO_NliU7DR7wp3AW8QrxtSR-Hvk",
    authDomain: "web-onthithptqg.firebaseapp.com",
    projectId: "web-onthithptqg",
    storageBucket: "web-onthithptqg.firebasestorage.app",
    messagingSenderId: "790413071332",
    appId: "1:790413071332:web:d2ea179b87cda53223edf1",
    measurementId: "G-PSR8GHMGD3"
};

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();
const facebookProvider = new firebase.auth.FacebookAuthProvider();

// Đẩy các object Firebase ra Global Scope để app.js và data.js có thể tái sử dụng
window.MTKL_Firebase = {
    auth,
    db,
    googleProvider,
    facebookProvider
};
