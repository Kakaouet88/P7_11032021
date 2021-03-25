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

// *****************userId************
var user = sessionStorage.getItem("user");
var userId = JSON.parse(user).USERID;

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
