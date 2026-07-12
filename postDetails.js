const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");
const postDetails = async () => {
    try {
        const response = await axios.get(
            `https://tarmeezacademy.com/api/v1/posts/${postId}`,
            {

            }
            
        );
        let post = response.data.data
        const postContainer = document.getElementById("single-post-container")
        postContainer.innerHTML =
        `
        <article class="post-card">
            <header class="post-header">
                <img src="${post.author.profile_image}" onerror="this.src='Images/download.png';" alt="user avatar" class="user-avatar">
                <span class="username-text">${post.author.username}</span>
            </header>
            
            <div class="image-wrapper">
                <img src="${post.image}" onerror="this.closest('.image-wrapper').remove();" class="post-img" alt="post image">
            </div>
            
            <div class="post-body">
                <h6 class="post-time">${post.created_at}</h6>
                <p class="post-desc">${post.body}</p>
                
                <hr class="custom-hr">
                
                <footer class="post-footer">
                    <div class="comments-count">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M16 8c0 3.866-3.582 7-8 7a8.841 8.841 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0z"/>
                        </svg>
                        <span>${post.comments_count}</span>
                    </div>
                    
                    <div class="tags-container"></div>
                </footer>
            </div>
        </article>
        `

        let postCommentsContainer = document.getElementById("comments-container")
        let postComments = post.comments
        for(comment of postComments){
            postCommentsContainer.innerHTML +=
            `
            <div class="comment-card">
                <div class="comment-user-info">
                    <span class="comment-username">${comment.author.username}</span>
                    <p class="comment-text">${comment.body}</p>
                </div>
            </div>
            `
        }

    }catch (error) {
        console.error(error);
    }
};
postDetails()

function showAlert(message, type) {
    const alertContainer = document.getElementById("alert-container");
    if (!alertContainer) return;

    const alertDiv = document.createElement("div");
        const isSuccess = type === "success";
    const bgColor = isSuccess ? "#66fcf1" : "#ff4757";
    const textColor = isSuccess ? "#0b0c10" : "#ffffff";
    const shadowColor = isSuccess ? "rgba(102, 252, 241, 0.5)" : "rgba(255, 71, 87, 0.5)";

    alertDiv.style.padding = "15px 20px";
    alertDiv.style.marginBottom = "10px";
    alertDiv.style.borderRadius = "8px";
    alertDiv.style.fontWeight = "bold";
    alertDiv.style.fontSize = "11pt";
    alertDiv.style.backgroundColor = bgColor;
    alertDiv.style.color = textColor;
    alertDiv.style.border = `1px solid ${bgColor}`;
    alertDiv.style.boxShadow = `0 4px 15px ${shadowColor}`;
    alertDiv.style.transition = "all 0.3s ease";
    
    alertDiv.innerHTML = message;
    alertContainer.appendChild(alertDiv);
        setTimeout(() => {
        alertDiv.style.opacity = "0";
        setTimeout(() => alertDiv.remove(), 300);
    }, 2500);
}

document.getElementById("submit-comment-btn").addEventListener("click",function(){
    let comment = document.getElementById("comment-input").value
    const token = localStorage.getItem("token")
    const createComment = async () => {
        try {
            const response = await axios.post(`https://tarmeezacademy.com/api/v1/posts/${postId}/comments`,
                {
                    "body": comment
                },
                {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            showAlert("Comment added successfully!", "success");
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            showAlert("Failed to add comment!", "danger");
        }
    }
    createComment();
})