let param = new URL(window.location).searchParams;
var editmode = param.get("id");
const title = document.getElementById("title");
const content = document.getElementById("content");
const image = document.getElementById("image");
const preview = document.querySelector(".preview");

var post;
const fetchPost = async () => {
  document.getElementById("loader").style.display = "block";
  post = await fetch(apiUrl + "/api/posts/" + editmode, {
    method: "GET",
    headers: new Headers(getheaders()),
  })
    .then((res) => res.json())
    .catch((error) => {
      alert(error);
    });
  console.log(post);
  document.getElementById("loader").style.display = "none";
  return post;
};

const displayForm = async () => {
  if (editmode) {
    await fetchPost();
    var oldImg = document.createElement("img");
    preview.appendChild(oldImg);
    title.value = post.title;
    content.value = post.content;
    oldImg.setAttribute("src", post.image);
    oldImg.setAttribute("style", "max-height: 10vw; min-height: 70px;");
    document
      .querySelector("#newpostform")
      .setAttribute("action", "/api/posts/" + editmode);
  }

  document.querySelector(".post-username").innerHTML = userName;

  // ***********AFFICHAGE DE LIMAGE SELECTIONNEE + LIMITE TAILLE************
  var input = document.querySelector("input[type=file]");

  input.addEventListener("change", updateImageDisplay);

  function updateImageDisplay() {
    while (preview.firstChild) {
      preview.removeChild(preview.firstChild);
    }
    var curFiles = input.files;
    if (curFiles.length === 0) {
      var para = document.createElement("p");
      para.textContent = "No files currently selected for upload";
      preview.appendChild(para);
    } else {
      var list = document.createElement("ol");
      preview.appendChild(list);
      for (var i = 0; i < curFiles.length; i++) {
        var listItem = document.createElement("li");
        var para = document.createElement("p");
        para.classList.add("text-muted");
        if (validFileType(curFiles[i])) {
          if (input.files[0].size > 2097152) {
            para.innerHTML = ` <i class="bi bi-exclamation-circle-fill h5"></i> &nbsp;La taille de l'image ne peut excéder 2 Mo.`;
            input.value = "";
            para.setAttribute("class", "text-danger");
            para.classList.add("font-italic", "mt-3");
            listItem.appendChild(para);
          } else {
            para.textContent =
              curFiles[i].name + " - " + returnFileSize(curFiles[i].size) + ".";
            var image = document.createElement("img");
            image.src = window.URL.createObjectURL(curFiles[i]);

            listItem.appendChild(image);
            listItem.appendChild(para);
          }
        } else {
          para.textContent =
            "Fichier " +
            curFiles[i].name +
            ": Type de fichier non autorisé, modifiez votre sélection";
          listItem.appendChild(para);
        }

        list.appendChild(listItem);
      }
    }
  }

  var fileTypes = ["image/jpeg", "image/pjpeg", "image/png"];

  function validFileType(file) {
    for (var i = 0; i < fileTypes.length; i++) {
      if (file.type === fileTypes[i]) {
        return true;
      }
    }

    return false;
  }

  function returnFileSize(number) {
    if (number < 1024) {
      return number + " octets";
    } else if (number >= 1024 && number < 1048576) {
      return (number / 1024).toFixed(1) + " Ko";
    } else if (number >= 1048576) {
      return (number / 1048576).toFixed(1) + " Mo";
    }
  }
};

displayForm();

// ***********ENVOI REQUETE VALIDATION FORMULAIRE SELON MODE ******************
const formAction = async () => {
  document.getElementById("postEdit").addEventListener("click", function () {
    var postObj = new FormData();
    if (image.files[0]) {
      postObj.append("title", title.value);
      postObj.append("content", content.value);
      postObj.append("image", image.files[0]);
    } else {
      postObj.append("title", title.value);
      postObj.append("content", content.value);
    }

    if (!editmode) {
      // *****************MODE CREA****************
      let route = "/api/posts";
      xhrpostform(postObj, route)
        .then((res) => {
          if ((res.status = 201)) {
            window.location.assign("accueil.html");
          }
        })
        .catch((error) => console.log(error));
    } else {
      // ********************MODE EDIT********************
      let route = "/api/posts/" + editmode;
      xhrputform(postObj, route)
        .then((res) => {
          if ((res.status = 201)) {
            window.location.assign("post.html?id=" + editmode);
          }
        })
        .catch((error) => console.log(error));
    }
  });
};

formAction();

// **********VALIDATION TEXTAREA****************
var regexContent = new RegExp("^[^<>{}~*]*$");
content.addEventListener("input", () => {
  var textContent = content.value;
  var match = regexContent.test(textContent);
  if (!match) {
    content.classList.add("invalid");
    para = document.createElement("p");
    para.innerHTML = ` <i class="bi bi-exclamation-circle-fill h5"></i>&nbsp; 3 caractères min. et caractères spéciaux interdits !`;
    para.setAttribute("class", "text-danger");
    para.setAttribute("id", "PARA");
    para.classList.add("font-italic", "mt-3");
    var PARA = document.getElementById("PARA");
    if (PARA) PARA.remove();
    content.parentNode.insertBefore(para, content.nextSibling);
  } else {
    content.classList.remove("invalid");
    var PARA = document.getElementById("PARA");
    if (PARA) PARA.remove();
  }
});
// **********VALIDATION TITRE****************
var regexContent = new RegExp("^[^<>{}~*]*$");
title.addEventListener("input", () => {
  var textContent = title.value;
  var match = regexContent.test(textContent);
  if (!match) {
    title.classList.add("invalid");
    para = document.createElement("p");
    para.innerHTML = ` <i class="bi bi-exclamation-circle-fill h5"></i>&nbsp; 3 caractères min. et caractères spéciaux interdits !`;
    para.setAttribute("class", "text-danger");
    para.setAttribute("id", "PARA");
    para.classList.add("font-italic", "mt-3");
    var PARA = document.getElementById("PARA");

    if (PARA) {
      PARA.remove();
    }
    title.parentNode.insertBefore(para, title.nextSibling);
  } else {
    title.classList.remove("invalid");
    var PARA = document.getElementById("PARA");
    if (PARA) {
      PARA.remove();
    }
  }
});
