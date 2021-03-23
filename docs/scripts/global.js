let apiUrl = "http://localhost:3000";

// **********************Formatage des dates mysql**************************
const updatedAtFormat = (str) => {
  let date = str.split("T")[0];
  let hour = str.split("T")[1].split(".")[0].split(":")[0];
  let minutes = str.split("T")[1].split(".")[0].split(":")[1];
  let formatDate = date + " " + hour + ":" + minutes;
  return formatDate;
};

//  *********************requete POST****************

var xhrpost = function (x, route) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if (xhr.status == 201) {
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
};
