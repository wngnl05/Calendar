document.querySelector("#signupButton").addEventListener("click", async function(){
    const userName = document.querySelector("#userName").value;
    const userPassword = document.querySelector("#userPassword").value;

    const response = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, userPassword })
    })

    if (!response.ok) { return alert( (await response.json()).error ) }

    alert("회원가입이 정상적으로 처리되었습니다.");
    window.location.href="/login"
})