const username = document.getElementById("username");
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
      username: username.value,
      email: email.value,
      password: password.value,
    };
    xhrpost(userObj, "/api/auth/signup").then((res) => {
      if ((res.status = 201)) {
        window.location.assign("index.html");
      }
    });
  }
});
