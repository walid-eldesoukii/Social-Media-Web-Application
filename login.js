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
    } catch (error) {
        alert("Data entered are wrong");
    }
})