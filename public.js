document.addEventListener("DOMContentLoaded", ()=>{
    const logoutBtn = document.getElementById("logoutBtn");

    logoutBtn.addEventListener("click", ()=>{
        firebase.auth().signOut().then(()=>{
            localStorage.removeItem("loggedInUser");
            localStorage.removeItem("userType");
            window.location.href = "login.html";
        }).catch(err=>{
            console.error(err);
            alert("Logout failed: " + err.message);
        });
    });

    // Sample matches data
    const matches = [
        {name: "Match 1", date: "2025-12-10", prize: "$1000"},
        {name: "Match 2", date: "2025-12-12", prize: "$1500"}
    ];

    const matchesList = document.getElementById("matchesList");
    matches.forEach(match=>{
        const li = document.createElement("li");
        li.textContent = `${match.name} - ${match.date} - Prize: ${match.prize}`;
        matchesList.appendChild(li);
    });
});
