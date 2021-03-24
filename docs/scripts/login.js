const email = document.getElementById("email");
const password = document.getElementById("password");

var checkForm = function () {
  if (email.reportValidity() && password.reportValidity()) {
    return true;
  } else {
    return false;
  }
};

document.getElementById("formbtn").addEventListener("click", function () {
  if (checkForm()) {
    let userObj = {
      email: email.value,
      password: password.value,
    };
    xhrpost(userObj, "/api/auth/login").then((res) => {
      if ((res.status = 200)) {
        window.location.assign("accueil.html");
      }
    });
  }
});
