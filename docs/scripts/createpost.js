let param = new URL(window.location).searchParams;
var editmode = param.get("id");
const title = document.getElementById("title");
const content = document.getElementById("content");
const image = document.getElementById("image");

var post;
const fetchPost = async () => {
  post = await fetch(apiUrl + "/api/posts/" + editmode, {
    method: "GET",
    headers: new Headers(getheaders()),
  })
    .then((res) => res.json())
    .catch((error) => {
      alert(error);
    });
  console.log(post);
  return post;
};

const displayForm = async () => {
  if (editmode) {
    await fetchPost();
    title.value = post.title;
    content.value = post.content;
    image.value = post.image;
  }

  document.querySelector(".post-username").innerHTML = userName;

  var input = document.querySelector("input[type=file]");
  var preview = document.querySelector(".preview");

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
          para.textContent =
            curFiles[i].name + " - " + returnFileSize(curFiles[i].size) + ".";
          var image = document.createElement("img");
          image.src = window.URL.createObjectURL(curFiles[i]);

          listItem.appendChild(image);
          listItem.appendChild(para);
        } else {
          para.textContent =
            "File name " +
            curFiles[i].name +
            ": Not a valid file type. Update your selection.";
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
    let postObj = {
      title: title.value,
      content: content.value,
    };

    if (!editmode) {
      // *****************MODE CREA****************
      fetch("/api/posts", {
        method: "POST",
        headers: new Headers(getheaders()),
        body: postObj,
        file: image.files[0],
      })
        .then((res) => {
          if ((res.status = 201)) {
            console.log("pip");
            // window.location.assign("post.html?id=" + editmode);
          }
        })
        .catch((error) => console.log(error));
    } else {
      // ********************MODE EDIT********************
      let postObj = {
        title: title.value,
        content: content.value,
      };
      fetch("/api/posts", {
        method: "PUT",
        headers: new Headers(getheaders()),
        body: postObj,
        file: image.files[0],
      })
        .then((res) => {
          if ((res.status = 201)) {
            console.log("pip");
            // window.location.assign("post.html?id=" + editmode);
          }
        })
        .catch((error) => console.log(error));
    }
  });
};

formAction();
