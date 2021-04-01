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
    xhrpostauth(userObj, "/api/auth/login")
      .then((res) => {
        if ((res.status = 200)) {
          let userinfos = {
            TOKEN: res.token,
            USERID: res.userId,
            ISADMIN: res.isadmin,
            USERNAME: res.username,
          };
          sessionStorage.setItem("user", JSON.stringify(userinfos));
          window.location.assign("accueil.html");
        }
      })
      .catch((error) => console.log(error));
  }
});

toggle();
