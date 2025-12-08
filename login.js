document.addEventListener("DOMContentLoaded", ()=>{
    const loginBtn = document.getElementById("googleLoginBtn");

    loginBtn.addEventListener("click", ()=>{
        const provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider)
        .then(result => {
            const user = result.user;
            const email = user.email;

            // ALWAYS SAVE HERE
            localStorage.setItem("loggedInUser", email);

            // Admin email list
            const adminEmails = ["surushannu@gmail.com"];

            if (adminEmails.includes(email)) {
                localStorage.setItem("userType", "admin");
                window.location.href = "admin.html";
            } 
            else {
                localStorage.setItem("userType", "player");
                window.location.href = "public.html";
            }
        })
        .catch(err => {
            console.error(err);
            alert("Login failed: " + err.message);
        });
    });
});
