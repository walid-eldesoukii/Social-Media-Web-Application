document.getElementById("logoutButton").addEventListener("click", function (){
    localStorage.removeItem("token")
    window.location.href = "login.html"
})
// ==================== 1. جلب البيانات من الـ localStorage ====================
const token = localStorage.getItem("token");
const username = localStorage.getItem("username");
const name = localStorage.getItem("name");
const email = localStorage.getItem("email");
const profilePhoto = localStorage.getItem("profilePhoto");

// ==================== 2. حقن الصور الشخصية (بالكلاس المشترك) ====================
const allAvatarImages = document.querySelectorAll(".user-profile-avatar-img");

if (profilePhoto && profilePhoto !== "undefined" && profilePhoto !== "null") {
    allAvatarImages.forEach(img => {
        img.src = profilePhoto;
    });
} else {
    allAvatarImages.forEach(img => {
        img.src = "https://placehold.co/120"; // صورة افتراضية لو مش رافع صورة
    });
}

// ==================== 3. حقن البيانات النصية (بالـ IDs) ====================

// قنص العناصر من الـ HTML
const navUsernameEl = document.getElementById("navUsername");
const mainProfileNameEl = document.getElementById("mainProfileName");
const mainProfileUsernameEl = document.getElementById("mainProfileUsername");
const mainProfileEmailEl = document.getElementById("mainProfileEmail");

// تغيير النصوص لو العناصر موجودة في الصفحة واليوزر مسجل
if (token) {
    if (navUsernameEl) navUsernameEl.textContent = username; // اللي في الناف بار
    if (mainProfileNameEl) mainProfileNameEl.textContent = name;     // الاسم الكبير
    if (mainProfileUsernameEl) mainProfileUsernameEl.textContent = `@${username}`; // اليوزر نيم
    if (mainProfileEmailEl) mainProfileEmailEl.textContent = email;   // الإيميل
}