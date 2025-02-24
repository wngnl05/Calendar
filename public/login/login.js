document.querySelector("#loginButton").addEventListener("click", async function(){
    const userName = document.querySelector("#userName").value;
    const userPassword = document.querySelector("#userPassword").value;

    const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, userPassword })
    })

    if (!response.ok) { return alert( (await response.json()).error ) }
    window.location.href="/calendar"
})