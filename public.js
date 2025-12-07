document.addEventListener("DOMContentLoaded", ()=>{

    // ===== Login Check =====
    if(localStorage.getItem("userType") !== "player"){
        alert("Unauthorized! Please login as player.");
        window.location.href = "login.html";
    }

    // ===== Logout =====
    document.getElementById("logoutBtn").addEventListener("click", ()=>{
        localStorage.removeItem("userType");
        localStorage.removeItem("userEmail");
        alert("Logged out");
        window.location.href = "login.html";
    });

    // ===== Upcoming Matches =====
    const matchesList = document.getElementById("matchesList");
    const matches = JSON.parse(localStorage.getItem("matches")) || [];
    if(matches.length === 0){
        matchesList.innerHTML = "<li>No upcoming matches</li>";
    } else {
        matches.forEach(m=>{
            const li = document.createElement("li");
            li.textContent = `${m.name} - ${m.date} ${m.time} | Players: ${m.players}`;
            matchesList.appendChild(li);
        });
    }

    // ===== Contact Us =====
    document.getElementById("sendMsgBtn").addEventListener("click", ()=>{
        const name = document.getElementById("contactName").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const msg = document.getElementById("contactMsg").value.trim();

        if(!name || !email || !msg){
            alert("Please fill all fields");
            return;
        }

        alert(`Message sent!\nName: ${name}\nEmail: ${email}\nMessage: ${msg}`);

        // Clear form
        document.getElementById("contactName").value = "";
        document.getElementById("contactEmail").value = "";
        document.getElementById("contactMsg").value = "";
    });

});
