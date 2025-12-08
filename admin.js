let editKey = null;

const matchesRef = firebase.database().ref('matches');

const popupOverlay = document.getElementById('popupOverlay');
const popupTitle = document.getElementById('popupTitle');
const matchName = document.getElementById('matchName');
const matchId = document.getElementById('matchId');
const entryFee = document.getElementById('entryFee');
const prize = document.getElementById('prize');
const date = document.getElementById('date');
const time = document.getElementById('time');
const roomId = document.getElementById('roomId');
const password = document.getElementById('password');
const matchList = document.getElementById('matchList');
const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', ()=>{
  firebase.auth().signOut().then(()=>{
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('userType');
    alert("Logged out successfully!");
    window.location.href = "login.html";
  }).catch(err=>{
    console.error(err);
    alert("Logout failed: " + err.message);
  });
});

// Switch sections
function showSection(id){
  document.querySelectorAll(".section").forEach(sec=>sec.style.display="none");
  document.getElementById(id).style.display="block";
  if(id==='players') loadPendingPlayers();
}

// Popup
function openPopup(key=null, match=null){
  editKey=key;
  if(key && match){
    popupTitle.innerText="Edit Match";
    matchName.value=match.name;
    matchId.value=match.matchId;
    entryFee.value=match.entryFee;
    prize.value=match.prize;
    date.value=match.date;
    time.value=match.time;
    roomId.value=match.roomId;
    password.value=match.password;
  } else {
    popupTitle.innerText="Add Match";
    document.querySelectorAll(".popup input").forEach(i=>i.value="");
  }
  popupOverlay.style.display="flex";
}
function closePopup(){popupOverlay.style.display="none";}

// Save match
function saveMatch(){
  const obj={
    name: matchName.value,
    matchId: matchId.value,
    entryFee: entryFee.value,
    prize: prize.value,
    date: date.value,
    time: time.value,
    roomId: roomId.value,
    password: password.value
  };
  if(editKey) matchesRef.child(editKey).update(obj);
  else matchesRef.push(obj);
  closePopup();
}

// Delete match
function deleteMatch(key){
  if(confirm("Delete this match?")) matchesRef.child(key).remove();
}

// Load matches realtime
matchesRef.on('value', snapshot=>{
  matchList.innerHTML='';
  const data = snapshot.val();
  if(data){
    Object.entries(data).forEach(([key, m])=>{
      const div=document.createElement('div');
      div.classList.add('match-card');
      div.innerHTML=`
        <h3>${m.name}</h3>
        <p><b>ID:</b> ${m.matchId}</p>
        <p><b>Fee:</b> ${m.entryFee}</p>
        <p><b>Prize:</b> ${m.prize}</p>
        <p><b>Date:</b> ${m.date}</p>
        <p><b>Time:</b> ${m.time}</p>
        <div class="card-btns">
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </div>
      `;
      matchList.appendChild(div);
      div.querySelector('.edit-btn').addEventListener('click', ()=>openPopup(key,m));
      div.querySelector('.delete-btn').addEventListener('click', ()=>deleteMatch(key));
    });
  } else matchList.innerHTML="<p>No matches added yet.</p>";
});

// Pending players (localStorage logic)
function loadPendingPlayers(){
  let approvals=JSON.parse(localStorage.getItem("approvals"))||{};
  let playerList=document.getElementById("playerList");
  playerList.innerHTML="";
  let hasPending=false;
  for(let email in approvals){
    if(approvals[email].startsWith("pending_")){
      let matchId=approvals[email].replace("pending_","");
      hasPending=true;
      playerList.innerHTML+=`
        <div class="match-card">
          <h3>${email}</h3>
          <p>Match ID: <b>${matchId}</b></p>
          <p>Status: <b>Pending</b></p>
          <button style="background:green;color:white;padding:7px;border:none;border-radius:5px;"
            onclick="approvePlayer('${email}')">Approve</button>
          <button style="background:red;color:white;padding:7px;border:none;border-radius:5px;margin-left:5px;"
            onclick="rejectPlayer('${email}')">Reject</button>
        </div>`;
    }
  }
  if(!hasPending) playerList.innerHTML="<p>No pending approval requests.</p>";
}

function approvePlayer(email){
  let approvals=JSON.parse(localStorage.getItem("approvals"))||{};
  let matchId=approvals[email].split("_")[1];
  approvals[email]="approved_"+matchId;
  localStorage.setItem("approvals",JSON.stringify(approvals));
  alert(email+" approved!");
  loadPendingPlayers();
}

function rejectPlayer(email){
  let approvals=JSON.parse(localStorage.getItem("approvals"))||{};
  delete approvals[email];
  localStorage.setItem("approvals",JSON.stringify(approvals));
  alert(email+" rejected!");
  loadPendingPlayers();
}
