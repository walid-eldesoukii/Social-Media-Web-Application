document.getElementById("registerForm").addEventListener("submit",async function(event){
    event.preventDefault()
    
    const registerUsername = document.getElementById("registerUsername").value
    const registerPassword = document.getElementById("registerPassword").value
    const registerEmail = document.getElementById("registerEmail").value
    const registerName = document.getElementById("registerName").value
    const registerPhoto = document.getElementById("registerPhoto").files[0]

    const formData = new FormData()
    formData.append("username",registerUsername)
    formData.append("password",registerPassword)
    formData.append("email",registerEmail)
    formData.append("name",registerName)
    if(registerPhoto){
        formData.append("image",registerPhoto)
    }

    try {
        const response = await axios.post(
            "https://tarmeezacademy.com/api/v1/register",
            formData
        );
        const token = response.data.token
        const username = response.data.user.username
        const email = response.data.user.email
        const name = response.data.user.name
        const profilePhoto = response.data.user.profile_image

        localStorage.setItem("token",token)
        localStorage.setItem("username",username)
        localStorage.setItem("email",email)
        localStorage.setItem("name",name)
        localStorage.setItem("profilePhoto",profilePhoto)

        window.location.href = "index.html";
    }catch (error) {
        const errorContainer = document.getElementById("errorContainer");
        
        let errorMessage = "Registration failed! Please try again.";
        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        }
        
        errorContainer.innerHTML = `
            <div class="error-box" id="errorAlert">
                ⚠️ ${errorMessage}
            </div>
        `;
        
        setTimeout(function() {
            const errorAlert = document.getElementById("errorAlert");
            if (errorAlert) {
                errorContainer.innerHTML = ""; 
            }
        }, 4000);
    }
})