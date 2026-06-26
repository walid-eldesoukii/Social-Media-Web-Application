document.getElementById("loginForm").addEventListener("submit",async function(event){
    event.preventDefault()
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    try {
        const response = await axios.post(
            "https://tarmeezacademy.com/api/v1/login",
            {
                "username" : username,
                "password" : password
            }
        );
        const token = response.data.token
        localStorage.setItem("token",token)
        window.location.href = "index.html"
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