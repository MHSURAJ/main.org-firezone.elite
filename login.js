import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup,
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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
const provider = new GoogleAuthProvider();

// -------- Google Login Button --------
document.getElementById("googleLogin").onclick = function() {
    signInWithPopup(auth, provider)
        .then(() => {
            window.location.href = "public.html";
        })
        .catch(err => {
            alert("Error: " + err.message);
        });
};

// -------- If already logged in, auto redirect --------
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "public.html";
    }
});
