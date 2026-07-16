//====================
// SIGN UP
//====================

const signupForm = document.getElementById("signupForm");

if(signupForm){

signupForm.addEventListener("submit",function(e){

e.preventDefault();

let email=document.getElementById("signupEmail").value.trim();
let password=document.getElementById("signupPassword").value;
let confirm=document.getElementById("confirmPassword").value;

let error=document.getElementById("signupError");

error.innerHTML="";

if(!email.endsWith("@gmail.com")){
    error.innerHTML="Email must end with @gmail.com";
    return;
}

if(password.length<6){
    error.innerHTML="Password must be at least 6 characters.";
    return;
}

if(password!==confirm){
    error.innerHTML="Passwords do not match.";
    return;
}

//Save account

localStorage.setItem("email",email);
localStorage.setItem("password",password);

alert("Account created successfully!");

window.location.href="home.html";

});

}

//====================
// LOGIN
//====================

const loginForm=document.getElementById("loginForm");

if(loginForm){

loginForm.addEventListener("submit",function(e){

e.preventDefault();

let email=document.getElementById("loginEmail").value.trim();
let password=document.getElementById("loginPassword").value;

let storedEmail=localStorage.getItem("email");
let storedPassword=localStorage.getItem("password");

let error=document.getElementById("loginError");

error.innerHTML="";

if(!email.endsWith("@gmail.com")){
    error.innerHTML="Email must end with @gmail.com";
    return;
}

if(email===storedEmail && password===storedPassword){

alert("Login Successful!");

window.location.href="home.html";

}
else{

error.innerHTML="Incorrect email or password.";

}

});

}
