let postsContainer = document.getElementById("posts-container")
const getPosts = async () => {
    try {

        const response = await axios.get(
            "https://tarmeezacademy.com/api/v1/posts",
            {
            params: {
                limit: 10,
            },
            }
        );

        let posts = response.data.data
        postsContainer.innerHTML = ""

        for(post of posts){

            let tagsContent = ""

            for(tag of post.tags){
                tagsContent += `<span class="tag-badge">${tag.name}</span>`
            }

            let userAvatar = "Images/download.png";
            if (typeof post.author.profile_image === "string" && post.author.profile_image.trim() !== "") {
                userAvatar = post.author.profile_image;
            }

            let postImage = ""
            if (typeof post.image === "string" && post.image.trim() !== "") {
                postImage = `<div class="image-wrapper"><img src="${post.image}" onerror="this.parentElement.style.display='none'" class="post-img" alt="post image"></div>`
            }

            postsContainer.innerHTML += `
            <article class="post-card">
                <header class="post-header">
                    <img src="${userAvatar}" onerror="this.src='Images/download.png'" alt="user avatar" class="user-avatar">
                    <span class="username-text">${post.author.username}</span>
                </header>
                    ${postImage}
                <div class="post-body">
                    <h6 class="post-time">${post.created_at}</h6>
                    <p class="post-desc">${post.title}</p>
                    <hr class="custom-hr">
                    
                    <footer class="post-footer">
                        <div class="comments-count">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.707l-1.587-1.587z"/>
                            </svg>
                            <span>${post.comments_count} Comments</span>
                        </div>
                        <div class="tags-container" id="postTags">
                            ${tagsContent}
                        </div>
                    </footer>
                </div>
            </article>
            `
        }

    }catch (error) {
        console.error(error);
    }
};
getPosts()