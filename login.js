// 👁 Toggle Password
function togglePassword(el) {
    const pass = document.getElementById("pass");

    if (pass.type === "password") {
        pass.type = "text";
        el.classList.add("hide");
    } else {
        pass.type = "password";
        el.classList.remove("hide");
    }
}

// 📌 Elements
const form = document.getElementById("loginForm");
const emailInput = document.getElementById("user");
const passInput = document.getElementById("pass");
const errorMsg = document.getElementById("errorMsg");
const checkbox = document.getElementById("cb");
const loginBtn = document.getElementById("loginBtn");

// ✅ Auto Fill (لما الصفحة تفتح)
window.onload = function () {
    const savedEmail = localStorage.getItem("email");

    if (savedEmail) {
        emailInput.value = savedEmail;
        checkbox.checked = true;
    }
};

// ✅ Validation + Submit
form.addEventListener("submit", function (e) {
    const email = emailInput.value.trim();
    const pass = passInput.value.trim();

    errorMsg.textContent = ""; // reset

    if (email === "" || pass === "") {
        errorMsg.textContent = "Please fill all fields";
        e.preventDefault();
        return;
    }

    if (!email.includes("@")) {
        errorMsg.textContent = "Enter a valid email";
        e.preventDefault();
        return;
    }

    if (pass.length < 6) {
        errorMsg.textContent = "Password must be at least 6 characters";
        errorMsg.style.color = "red";
        e.preventDefault();
        return;
    }

    // 💾 Remember Me
    if (checkbox.checked) {
        localStorage.setItem("email", email);
    } else {
        localStorage.removeItem("email");
    }

    // 🔄 Loading effect
    loginBtn.value = "Logging in...";
});