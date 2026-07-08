document.getElementById("logoutButton").addEventListener("click", function (){
    localStorage.clear();
    window.location.href = "login.html"
})
const token = localStorage.getItem("token");
const username = localStorage.getItem("username");
const name = localStorage.getItem("name");
const email = localStorage.getItem("email");
const profilePhoto = localStorage.getItem("profilePhoto");

const allAvatarImages = document.querySelectorAll(".user-profile-avatar-img");

if (profilePhoto && profilePhoto !== "undefined" && profilePhoto !== "null") {
    allAvatarImages.forEach(img => {
        img.src = profilePhoto;
    });
} else {
    allAvatarImages.forEach(img => {
        img.src = "https://placehold.co/120";
    });
}


// قنص العناصر من الـ HTML
const navUsernameEl = document.getElementById("navUsername");
const mainProfileNameEl = document.getElementById("mainProfileName");
const mainProfileUsernameEl = document.getElementById("mainProfileUsername");
const mainProfileEmailEl = document.getElementById("mainProfileEmail");

if (token) {
    if (navUsernameEl) navUsernameEl.textContent = username; 
    if (mainProfileNameEl) mainProfileNameEl.textContent = name;
    if (mainProfileUsernameEl) mainProfileUsernameEl.textContent = `@${username}`; 
    if (mainProfileEmailEl) mainProfileEmailEl.textContent = email;  
}