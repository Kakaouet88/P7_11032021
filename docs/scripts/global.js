let apiUrl = "http://localhost:3000";

// **********************Formatage des dates mysql**************************
const updatedAtFormat = (str) => {
  let date = str.split("T")[0];
  let hour = str.split("T")[1].split(".")[0].split(":")[0];
  let minutes = str.split("T")[1].split(".")[0].split(":")[1];
  let formatDate = date + " " + hour + ":" + minutes;
  return formatDate;
};

// *************HEADERS*******************
const getheaders = () => {
  var user = sessionStorage.getItem("user");
  var token = JSON.parse(user).TOKEN;
  const headers = {
    Authorization: "Bearer" + " " + token,
    "Content-Type": "application/json",
  };
  return headers;
};

// *****************user infos************
var user = sessionStorage.getItem("user");
var userId = JSON.parse(user).USERID;
var tokenId = JSON.parse(user).TOKEN;
var isAdmin = JSON.parse(user).ISADMIN;
var userName = JSON.parse(user).USERNAME;

//  *********************requete POST****************
function xhrpost(x, route) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    var user = sessionStorage.getItem("user");
    var token = JSON.parse(user).TOKEN;

    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if (xhr.status == 201 || xhr.status == 200) {
          console.log("success", xhr);
          resolve(JSON.parse(xhr.responseText));
        } else {
          console.log("error");
          reject(xhr);
        }
      }
    };
    xhr.open("POST", apiUrl + route, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer" + " " + token);
    xhr.send(JSON.stringify(x));
  });
}

function xhrpostauth(x, route) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if (xhr.status == 201 || xhr.status == 200) {
          console.log("success", xhr);
          resolve(JSON.parse(xhr.responseText));
        } else {
          console.log("error");
          reject(xhr);
        }
      }
    };
    xhr.open("POST", apiUrl + route, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(x));
  });
}

// *****************CHECK FORM*************
function checkForm() {
  if (email.reportValidity() && password.reportValidity()) {
    return true;
  } else {
    return false;
  }
}

// **************USER PROFILE URL***************

document.getElementById("header-ul").innerHTML = `
<a href="./createpost.html" id="createpostbtn" class="p-0 m-0" title="créer un post"><li id="createpost" class="nav-link animate__animated animate__fadeIn animate__slow dropshadow-sm"><i class="bi bi-pencil-square"></i></li></a>
<a href="./profil.html?id=${userId}" id="profilepagebtn" class="p-0 m-0" title="mon profil"><li class="nav-link px-0 ml-4 animate__animated animate__fadeIn animate__slow dropshadow-sm"><i class="bi bi-person-circle"></i></li></a>
`;
