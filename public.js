document.addEventListener("DOMContentLoaded", ()=>{

  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-links li');

  // Slidebar navigation
  navLinks.forEach(link=>{
    link.addEventListener('click', ()=>{
      navLinks.forEach(l=>l.classList.remove('active'));
      link.classList.add('active');

      const target = link.getAttribute('data-section');
      sections.forEach(sec=>{
        if(sec.id === target){
          sec.classList.add('active');
        } else {
          sec.classList.remove('active');
        }
      });
    });
  });

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", ()=>{
    firebase.auth().signOut().then(()=>{
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("userType");
      window.location.href = "login.html";
    }).catch(err=>{
      console.error(err);
      alert("Logout failed: "+err.message);
    });
  });

  // Sample data for upcoming matches
  const matches = [
    {name: "Match 1", date: "2025-12-10", prize: "$1000"},
    {name: "Match 2", date: "2025-12-12", prize: "$1500"},
    {name: "Match 3", date: "2025-12-15", prize: "$2000"},
  ];

  const matchesList = document.getElementById("matchesList");
  matches.forEach(match=>{
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `<h3>${match.name}</h3><p>Date: ${match.date}</p><p>Prize: ${match.prize}</p>`;
    matchesList.appendChild(card);
  });

  // Sample data for my matches
  const myMatches = [
    {name: "Match 1", date: "2025-12-10", status: "Registered"},
    {name: "Match 2", date: "2025-12-12", status: "Pending"},
  ];

  const myMatchesList = document.getElementById("myMatchesList");
  myMatches.forEach(match=>{
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `<h3>${match.name}</h3><p>Date: ${match.date}</p><p>Status: ${match.status}</p>`;
    myMatchesList.appendChild(card);
  });

});
