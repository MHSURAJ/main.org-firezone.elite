if(localStorage.getItem("userType") !== "player"){
    alert("Unauthorized! Please login as player.");
    window.location.href = "login.html";
}
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
    getDatabase, ref, get, update
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD66aIVOTVco6rTtpVinkl64UZGnZDgn1o",
  authDomain: "firezone-elite.firebaseapp.com",
  databaseURL: "https://firezone-elite-default-rtdb.firebaseio.com",
  projectId: "firezone-elite",
  storageBucket: "firezone-elite.firebasestorage.app",
  messagingSenderId: "121224317328",
  appId: "1:121224317328:web:a4d19bab51fc8076400b15",
  measurementId: "G-9YR0LYN37X"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

let currentUser = null;

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    } else {
        currentUser = user;
        loadAllMatches();
    }
});

function showSection(sec) {
    if (sec === "all") loadAllMatches();
    if (sec === "joined") loadJoinedMatches();
    if (sec === "contact") {
        document.getElementById("mainContent").innerHTML = `
            <h2>Contact Us</h2>
            <p>Email: <b>surushannu@gmail.com</b></p>
        `;
    }
}

async function loadAllMatches() {
    const snap = await get(ref(db, "tournaments"));

    let html = `<h2>All Matches</h2>`;

    snap.forEach(match => {
        let m = match.val();
        let id = match.key;

        html += `
        <div class="match-card">
            <h3>Match ID: ${id}</h3>
            <p>Date: ${m.date}</p>
            <p>Time: ${m.time}</p>
            <p>Entry: ${m.entryFee}</p>
            <p>Prize: ${m.prize}</p>
            <p>Winners: ${m.winners}</p>
            <button onclick="registerMatch('${id}')">Register</button>
        </div>
        `;
    });

    document.getElementById("mainContent").innerHTML = html;
}

async function registerMatch(matchID) {
    await update(ref(db, `tournaments/${matchID}/players/${currentUser.uid}`), {
        registered: true,
        approved: false
    });

    alert("Registration sent! Wait for admin approval.");
}
window.registerMatch = registerMatch;
