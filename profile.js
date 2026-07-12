document.getElementById("logoutButton").addEventListener("click", function (){
    localStorage.clear();
    window.location.href = "login.html"
})
const token = localStorage.getItem("token");
const username = localStorage.getItem("username");
const name = localStorage.getItem("name");
const email = localStorage.getItem("email");
const profilePhoto = localStorage.getItem("profilePhoto");
const userId = localStorage.getItem("userId");

const allAvatarImages = document.querySelectorAll(".user-profile-avatar-img");

if (profilePhoto && profilePhoto !== "undefined" && profilePhoto !== "null") {
    allAvatarImages.forEach(img => {
        img.src = profilePhoto;
        img.onerror = function() { this.src = "Images/download.png"; };
    });
} else {
    allAvatarImages.forEach(img => {
        img.src = "Images/download.png";
    });
}

const navUsernameEl = document.getElementById("navUsername");
const mainProfileNameEl = document.getElementById("mainProfileName");
const mainProfileUsernameEl = document.getElementById("mainProfileUsername");
const mainProfileEmailEl = document.getElementById("mainProfileEmail");

if (token) {
    if (navUsernameEl) navUsernameEl.textContent = username; 
    if (mainProfileNameEl) mainProfileNameEl.textContent = name;
    if (mainProfileUsernameEl) mainProfileUsernameEl.textContent = `@${username}`; 
    if (mainProfileEmailEl) mainProfileEmailEl.textContent = email;  
    
    if (userId) {
        getUserPosts(userId);
    }
}

async function getUserPosts(userId) {
    try {
        const response = await axios.get(`https://tarmeezacademy.com/api/v1/users/${userId}/posts`);
        const posts = response.data.data;
        
        const postsContainer = document.getElementById("user-posts-container");
        postsContainer.innerHTML = "";

        const statCounts = document.querySelectorAll(".stat-count");
        if(statCounts.length > 0) statCounts[0].textContent = posts.length;

        let totalComments = 0;

        if(posts.length === 0) {
            if(statCounts.length > 1) statCounts[1].textContent = 0;
            postsContainer.innerHTML = `<p style="text-align:center; opacity:0.5; margin-top:20px;">You haven't posted anything yet.</p>`;
            return;
        }

        for (let post of posts) {
            totalComments += post.comments_count;

            const titleHtml = post.title ? `<h5 class="post-title-text">${post.title}</h5>` : "";
            
            postsContainer.innerHTML += `
            <article class="post-card">
                <header class="post-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <img src="${post.author.profile_image}" onerror="this.src='Images/download.png';" class="user-avatar" alt="user avatar">
                        <span class="username-text">${post.author.username}</span>
                    </div>
                    <div class="post-actions" style="display: flex; gap: 10px;">
                        <button class="action-btn edit-btn" onclick="editPost('${post.id}')">✏️ Edit</button>
                        <button class="action-btn delete-btn" onclick="deletePost('${post.id}')">🗑️ Delete</button>
                    </div>
                </header>
                <div class="image-wrapper">
                    <img src="${post.image}" onerror="this.closest('.image-wrapper').remove();" class="post-img" alt="post">
                </div>
                <div class="post-body">
                    <h6 class="post-time">${post.created_at}</h6>
                    ${titleHtml}
                    <p class="post-desc">${post.body}</p>
                    <hr class="custom-hr">
                    <footer class="post-footer">
                        <div class="comments-count" style="cursor: pointer;" onclick="window.location.href='postDetails.html?id=${post.id}'">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M16 8c0 3.866-3.582 7-8 7a8.841 8.841 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7z"/>
                            </svg>
                            <span>(${post.comments_count}) Comments</span>
                        </div>
                    </footer>
                </div>
            </article>
            `;
        }

        if(statCounts.length > 1) {
            statCounts[1].textContent = totalComments;
        }

    } catch (error) {
        console.error(error);
    }
}
function showCustomModal(title, isPrompt, messageText = "", defaultValue = "") {
    return new Promise((resolve) => {
        const modal = document.getElementById("customModal");
        const modalTitle = document.getElementById("modalTitle");
        const textarea = document.getElementById("modalTextarea");
        const message = document.getElementById("modalMessage");
        const confirmBtn = document.getElementById("modalConfirmBtn");
        const cancelBtn = document.getElementById("modalCancelBtn");

        modalTitle.textContent = title;
        
        if (isPrompt) {
            textarea.style.display = "block";
            textarea.value = defaultValue;
            message.style.display = "none";
        } else {
            textarea.style.display = "none";
            message.style.display = "block";
            message.textContent = messageText;
        }

        modal.style.display = "flex";

        function onConfirm() {
            cleanup();
            resolve({ isConfirmed: true, value: textarea.value });
        }

        function onCancel() {
            cleanup();
            resolve({ isConfirmed: false, value: "" });
        }

        function cleanup() {
            modal.style.display = "none";
            confirmBtn.removeEventListener("click", onConfirm);
            cancelBtn.removeEventListener("click", onCancel);
        }

        confirmBtn.addEventListener("click", onConfirm);
        cancelBtn.addEventListener("click", onCancel);
    });
}

async function deletePost(postId) {
    const result = await showCustomModal("Delete Post", false, "Are you sure you want to delete this post?");
    if (!result.isConfirmed) return;

    try {
        await axios.delete(`https://tarmeezacademy.com/api/v1/posts/${postId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        getUserPosts(userId);
    } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Failed to delete the post.");
    }
}

async function editPost(postId) {
    const postCard = document.querySelector(`button[onclick="editPost('${postId}')"]`).closest('.post-card');
    const oldBody = postCard.querySelector('.post-desc').textContent;

    const result = await showCustomModal("Edit Post", true, "", oldBody);
    if (!result.isConfirmed || result.value.trim() === "") return;

    const formData = new FormData();
    formData.append("body", result.value);
    formData.append("_method", "put"); 

    try {
        await axios.post(`https://tarmeezacademy.com/api/v1/posts/${postId}`, formData, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        getUserPosts(userId);
    } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Failed to update the post.");
    }
}