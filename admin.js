import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
    getDatabase, ref, get, push, set, update, remove
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

const adminEmail = "surushannu@gmail.com";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    } else {
        if (user.email !== adminEmail) {
            window.location.href = "public.html";
        } else {
            loadMatches();
        }
    }
});

window.loadMatches = async function () {
    const snap = await get(ref(db, "tournaments"));

    let html = `<h2>Upcoming Matches</h2>`;

    snap.forEach(match => {
        let m = match.val();
        let id = match.key;

        html += `
        <div class="box">
            <h3>${id}</h3>
            <p>Date: ${m.date}</p>
            <p>Time: ${m.time}</p>
            <button onclick="deleteMatch('${id}')">Delete</button>
        </div>
        `;
    });

    document.getElementById("adminContent").innerHTML = html;
};

window.addMatchForm = function () {
    document.getElementById("adminContent").innerHTML = `
        <h2>Add Match</h2>
        <div class="box">
            <input id="date" placeholder="Date"><br><br>
            <input id="time" placeholder="Time"><br><br>
            <input id="entry" placeholder="Entry Fee"><br><br>
            <input id="prize" placeholder="Prize"><br><br>
            <input id="winners" placeholder="Total Winners"><br><br>
            <button onclick="submitMatch()">Add</button>
        </div>
    `;
};

window.submitMatch = async function () {
    let id = "M" + Math.floor(Math.random()*999999);

    await set(ref(db, "tournaments/" + id), {
        date: date.value,
        time: time.value,
        entryFee: entry.value,
        prize: prize.value,
        winners: winners.value
    });

    alert("Match Added!");
    loadMatches();
};

window.deleteMatch = async function (id) {
    await remove(ref(db, "tournaments/" + id));
    alert("Match Deleted!");
    loadMatches();
};

window.approvalPage = async function () {
    document.getElementById("adminContent").innerHTML = `
        <h2>Player Approvals</h2>
        <p>Select a match to view approval requests.</p>
    `;
};
