// ===== Sidebar Buttons =====
const dashboardBtn = document.getElementById("dashboardBtn");
const matchBtn = document.getElementById("matchBtn");
const playerBtn = document.getElementById("playerBtn");
const logoutBtn = document.getElementById("logoutBtn");
const contentDiv = document.getElementById("content");

function clearActive() {
    document.querySelectorAll("#sidebar button").forEach(btn => btn.classList.remove("active"));
}

// ===== Dashboard View =====
dashboardBtn.addEventListener("click", () => {
    clearActive();
    dashboardBtn.classList.add("active");
    contentDiv.innerHTML = `<h1>Welcome to Admin Dashboard</h1>
                            <p>Select an option from the sidebar to manage matches or players.</p>`;
});

// ===== Match Management View =====
let matches = JSON.parse(localStorage.getItem("matches")) || [];

matchBtn.addEventListener("click", () => {
    clearActive();
    matchBtn.classList.add("active");
    renderMatchManagement();
});

function renderMatchManagement() {
    contentDiv.innerHTML = `
        <h2>Match Management</h2>
        <button class="add" id="addMatchBtn">Add Match</button>
        <table id="matchTable">
            <thead>
                <tr><th>Name</th><th>Date</th><th>Time</th><th>Players</th><th>Action</th></tr>
            </thead>
            <tbody></tbody>
        </table>
    `;
    const tbody = document.querySelector("#matchTable tbody");

    function renderTable() {
        tbody.innerHTML = "";
        matches.forEach((match, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${match.name}</td>
                <td>${match.date}</td>
                <td>${match.time}</td>
                <td>${match.players}</td>
                <td>
                    <button class="edit action">Edit</button>
                    <button class="delete action">Delete</button>
                </td>
            `;
            tr.querySelector(".edit").addEventListener("click", () => editMatch(index));
            tr.querySelector(".delete").addEventListener("click", () => deleteMatch(index));
            tbody.appendChild(tr);
        });
    }

    // ===== Add Match =====
    document.getElementById("addMatchBtn").addEventListener("click", () => {
        const name = prompt("Enter Match Name:"); if(!name) return;
        const date = prompt("Enter Match Date (YYYY-MM-DD):"); if(!date) return;
        const time = prompt("Enter Match Time (HH:MM):"); if(!time) return;
        const players = prompt("Enter Players (comma separated):"); if(!players) return;
        matches.push({name,date,time,players});
        localStorage.setItem("matches", JSON.stringify(matches));
        renderTable();
    });

    // ===== Edit Match =====
    function editMatch(index) {
        const match = matches[index];
        const name = prompt("Edit Match Name:", match.name); if(!name) return;
        const date = prompt("Edit Match Date (YYYY-MM-DD):", match.date); if(!date) return;
        const time = prompt("Edit Match Time (HH:MM):", match.time); if(!time) return;
        const players = prompt("Edit Players (comma separated):", match.players); if(!players) return;
        matches[index] = {name,date,time,players};
        localStorage.setItem("matches", JSON.stringify(matches));
        renderTable();
    }

    // ===== Delete Match =====
    function deleteMatch(index) {
        if(confirm("Are you sure you want to delete this match?")) {
            matches.splice(index,1);
            localStorage.setItem("matches", JSON.stringify(matches));
            renderTable();
        }
    }

    renderTable();
}

// ===== Player Approval View =====
let approvals = JSON.parse(localStorage.getItem("approvals")) || {};
const samplePlayers = [
    ["John Doe","john@example.com","1234567890"],
    ["Jane Smith","jane@example.com","0987654321"]
];

playerBtn.addEventListener("click", () => {
    clearActive();
    playerBtn.classList.add("active");
    renderPlayers();
});

function renderPlayers() {
    contentDiv.innerHTML = `
        <h2>Player Approval</h2>
        <table id="playerTable">
            <thead>
                <tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody></tbody>
        </table>
    `;
    const tbody = document.querySelector("#playerTable tbody");
    tbody.innerHTML = "";
    samplePlayers.forEach(row => {
        const [name,email,phone] = row;
        const tr = document.createElement("tr");
        let statusText = approvals[email] || "Pending";
        let statusClass = statusText==="approved"?"status-approved": statusText==="rejected"?"status-rejected":"";
        tr.innerHTML = `
            <td>${name}</td>
            <td>${email}</td>
            <td>${phone}</td>
            <td class="${statusClass}">${statusText}</td>
            <td>
                <button class="action approve" ${statusText==="approved"?"disabled":""}>Approve</button>
                <button class="action reject" ${statusText==="rejected"?"disabled":""}>Reject</button>
            </td>
        `;
        tr.querySelector(".approve").addEventListener("click", ()=>{
            approvals[email]="approved";
            localStorage.setItem("approvals",JSON.stringify(approvals));
            renderPlayers();
        });
        tr.querySelector(".reject").addEventListener("click", ()=>{
            approvals[email]="rejected";
            localStorage.setItem("approvals",JSON.stringify(approvals));
            renderPlayers();
        });
        tbody.appendChild(tr);
    });
}

// ===== Logout =====
logoutBtn.addEventListener("click", () => {
    if(confirm("Logout?")) {
        alert("You are logged out.");
        // window.location.href = "login.html"; // Optional redirect
    }
});
