let editIndex = null;

// Switch sections
function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
  document.getElementById(id).style.display = "block";

  if (id === "players") {
    loadPendingPlayers();
  }
}

// Open popup
function openPopup(i = null) {
  editIndex = i;

  if (i !== null) {
    const m = JSON.parse(localStorage.getItem("matches"))[i];

    popupTitle.innerText = "Edit Match";
    matchName.value = m.name;
    matchId.value = m.matchId;
    entryFee.value = m.entryFee;
    prize.value = m.prize;
    date.value = m.date;
    time.value = m.time;
    roomId.value = m.roomId;
    password.value = m.password;
  } else {
    popupTitle.innerText = "Add Match";
    document.querySelectorAll(".popup input").forEach(i => i.value = "");
  }

  popupOverlay.style.display = "flex";
}

// Close popup
function closePopup() {
  popupOverlay.style.display = "none";
}

// Save Match
function saveMatch() {
  let matches = JSON.parse(localStorage.getItem("matches")) || [];

  const obj = {
    name: matchName.value,
    matchId: matchId.value,
    entryFee: entryFee.value,
    prize: prize.value,
    date: date.value,
    time: time.value,
    roomId: roomId.value,
    password: password.value
  };

  if (editIndex !== null) {
    matches[editIndex] = obj;
  } else {
    matches.push(obj);
  }

  localStorage.setItem("matches", JSON.stringify(matches));
  loadMatches();
  closePopup();
}

// Delete match
function deleteMatch(i) {
  let matches = JSON.parse(localStorage.getItem("matches")) || [];
  matches.splice(i, 1);
  localStorage.setItem("matches", JSON.stringify(matches));
  loadMatches();
}

// Load Matches
function loadMatches() {
  let matches = JSON.parse(localStorage.getItem("matches")) || [];
  matchList.innerHTML = "";

  matches.forEach((m, i) => {
    matchList.innerHTML += `
      <div class="match-card">
        <h3>${m.name}</h3>
        <p><b>ID:</b> ${m.matchId}</p>
        <p><b>Fee:</b> ${m.entryFee}</p>
        <p><b>Prize:</b> ${m.prize}</p>
        <p><b>Date:</b> ${m.date}</p>
        <p><b>Time:</b> ${m.time}</p>
        
        <div class="card-btns">
          <button class="edit-btn" onclick="openPopup(${i})">Edit</button>
          <button class="delete-btn" onclick="deleteMatch(${i})">Delete</button>
        </div>
      </div>
    `;
  });
}

// =========================
//   PENDING PLAYERS SYSTEM
// =========================

function loadPendingPlayers() {
  let approvals = JSON.parse(localStorage.getItem("approvals")) || {};
  let playerList = document.getElementById("playerList");

  playerList.innerHTML = "";

  let hasPending = false;

  for (let email in approvals) {
    if (approvals[email] === "pending") {
      hasPending = true;

      playerList.innerHTML += `
        <div class="match-card">
          <h3>${email}</h3>
          <p>Status: <b>Pending</b></p>

          <button style="background:green;color:white;padding:7px;border:none;border-radius:5px;"
            onclick="approvePlayer('${email}')">Approve</button>

          <button style="background:red;color:white;padding:7px;border:none;border-radius:5px;margin-left:5px;"
            onclick="rejectPlayer('${email}')">Reject</button>
        </div>
      `;
    }
  }

  if (!hasPending) {
    playerList.innerHTML = "<p>No pending approval requests.</p>";
  }
}

function approvePlayer(email) {
  let approvals = JSON.parse(localStorage.getItem("approvals")) || {};
  approvals[email] = "approved";
  localStorage.setItem("approvals", JSON.stringify(approvals));

  alert(email + " approved!");
  loadPendingPlayers();
}

function rejectPlayer(email) {
  let approvals = JSON.parse(localStorage.getItem("approvals")) || {};
  delete approvals[email];
  localStorage.setItem("approvals", JSON.stringify(approvals));

  alert(email + " rejected!");
  loadPendingPlayers();
}

// Init
window.onload = loadMatches;
