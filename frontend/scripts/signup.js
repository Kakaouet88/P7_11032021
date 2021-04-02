const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");

document.getElementById("formbtn").addEventListener("click", function () {
  if (checkForm()) {
    let userObj = {
      username: username.value,
      email: email.value,
      password: password.value,
    };
    xhrpostauth(userObj, "/api/auth/signup")
      .then((res) => {
        if ((res.status = 201)) {
          console.log("pip");
          window.location.assign("index.html");
        }
      })
      .catch((error) => {
        alert("Adresse email déja associée à un compte");
        email.value = "";
        console.log(error);
      });
  }
});

toggle();
