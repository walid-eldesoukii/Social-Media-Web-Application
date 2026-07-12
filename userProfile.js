const urlParams = new URLSearchParams(window.location.search);
const profileUserId = urlParams.get("id");

const currentUsername = localStorage.getItem("username");
const currentProfilePhoto = localStorage.getItem("profilePhoto");

if (currentUsername) {
    document.getElementById("navUsername").textContent = currentUsername;
}
if (currentProfilePhoto && currentProfilePhoto !== "undefined" && currentProfilePhoto !== "null") {
    document.getElementById("navAvatar").src = currentProfilePhoto;
}

async function getUserProfileData() {
    if (!profileUserId) return;

    try {
        const response = await axios.get(`https://tarmeezacademy.com/api/v1/users/${profileUserId}/posts`);
        const posts = response.data.data;
        
        const postsContainer = document.getElementById("user-posts-container");
        postsContainer.innerHTML = ""; 

        if (posts.length > 0) {
            const author = posts[0].author;
            
            document.getElementById("userProfileName").textContent = author.name || author.username;
            document.getElementById("userProfileUsername").textContent = `@${author.username}`;
            document.getElementById("userProfileEmail").textContent = author.email || "No Email Provided";
            document.getElementById("titleUsername").textContent = author.username;
            
            if(author.profile_image) {
                document.getElementById("userProfileAvatar").src = author.profile_image;
                document.getElementById("userProfileAvatar").onerror = function() { this.src = "Images/download.png"; };
            }
            
            document.getElementById("userPostsCount").textContent = posts.length;
            
            let totalComments = 0;

            for (let post of posts) {
                totalComments += post.comments_count;
                const titleHtml = post.title ? `<h5 class="post-title-text">${post.title}</h5>` : "";

                postsContainer.innerHTML += `
                <article class="post-card">
                    <header class="post-header">
                        <img src="${post.author.profile_image}" onerror="this.src='Images/download.png';" class="user-avatar" alt="user avatar">
                        <span class="username-text">${post.author.username}</span>
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
            document.getElementById("userCommentsCount").textContent = totalComments;

        } else {
            postsContainer.innerHTML = `<p style="text-align:center; opacity:0.5; margin-top:20px;">This user hasn't posted anything yet.</p>`;
            
            try {
                const userRes = await axios.get(`https://tarmeezacademy.com/api/v1/users/${profileUserId}`);
                const user = userRes.data.data;
                document.getElementById("userProfileName").textContent = user.name || user.username;
                document.getElementById("userProfileUsername").textContent = `@${user.username}`;
                document.getElementById("titleUsername").textContent = user.username;
                if(user.profile_image) document.getElementById("userProfileAvatar").src = user.profile_image;
            } catch(e) { console.error(e); }
        }

    } catch (error) {
        console.error("Error fetching user profile data:", error);
    }
}

getUserProfileData();