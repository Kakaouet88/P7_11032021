// ***************FETCH*************
let posts;

const fetchProducts = async () => {
  posts = await fetch(apiUrl + "/api/posts", {
    method: "GET",
    headers: new Headers(getheaders()),
  })
    .then((res) => res.json())
    .catch((error) => {
      alert(error);
    });
  console.log(posts);
  document.getElementById("loader").style.display = "none";
  return posts;
};

// **************************PAGE INDEX******************************

// AFFICHER LA LISTE DES ARTICLES SUR LA PAGE ACCUEIL

const displayProductsList = async () => {
  await fetchProducts();

  document.getElementById("bannertext").innerHTML = userName;

  posts
    .map((post) => {
      if (post.image) {
        document.getElementById("page-content").innerHTML += `
    <div class="card gedf-card col-md-8 mx-auto mt-3 dropshadow-sm animate__animated animate__fadeInUp">
        <div class="card-header d-flex align-items-center pl-3 p-0">
        <a href="./profil.html?id=${
          post.UserId
        }" title="voir profil"><div class="mr-2 pb-2">
                        <i class="bi bi-person-circle post-pic"></i>
                    </div></a>
                    <div class="ml-2">
                    <div class="post-username m-0"> ${post.User.username} </div>
                    </div>
                    </div>
        <a href="./post.html?id=${
          post.id
        }" class="postlink" title="voir post"><div class="card-body py-2">
        <p class="font-weight-bold">${post.title}</p>
            <p class="card-text postContent">${post.content}</p>
            <img class="my-3" id="postImg" src="${
              post.image
            }" alt="image du post" style="width:100%;">
            <div class="text-muted post-createdat h6">  <i class="bi bi-clock"></i> ${updatedAtFormat(
              post.updatedAt
            )} &nbsp;&nbsp;&nbsp;<i class="bi bi-chat-left-dots"></i> ${
          post.Comments.length
        } </div>
        </div></a>
        <div id="post-com" class="m-0 p-0">
        
        </div>
        
        <div class="card-footer">
        <div class="dropdown">
        <button class="btn dropdown-toggle" type="button" id="dropdownmenu" data-dropupAuto="false" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <i class="bi bi-chat-left-dots"></i> Commenter
        </button>
        <div class="dropdown-menu position-absolute col-11 col-md-11 px-4 py-2">
        <form>
        <div class="form-group">
        <label for="content"><i class="bi bi-chat-left-dots"></i></label>
          <textarea type="text" minlength="3" class="form-control comTextArea" id="com-${
            post.id
          }" placeholder=" 3 caractères min. "></textarea>
          </div>
          <button class="btn postCom btn-com" data-pid="${
            post.id
          }">Commenter</button>
          </form>
                    </div>
                    </div>
                    </div>
                    </div>
                    
                    `;
      } else {
        document.getElementById("page-content").innerHTML += `
    <div class="card gedf-card col-md-8 mx-auto mt-3 dropshadow-sm animate__animated animate__fadeInUp">
        <div class="card-header d-flex align-items-center pl-3 p-0">
        <a href="./profil.html?id=${
          post.UserId
        }" title="voir profil"><div class="mr-2 pb-2">
                        <i class="bi bi-person-circle post-pic"></i>
                    </div></a>
                    <div class="ml-2">
                    <div class="post-username m-0"> ${post.User.username} </div>
                    </div>
                    </div>
        <a href="./post.html?id=${
          post.id
        }" class="postlink" title="voir post"><div class="card-body py-2">
        <p class="font-weight-bold">${post.title}</p>
            <p class="card-text postContent">${post.content}</p>
            <div class="text-muted post-createdat h6">  <i class="bi bi-clock"></i> ${updatedAtFormat(
              post.updatedAt
            )} &nbsp;&nbsp;&nbsp;<i class="bi bi-chat-left-dots"></i> ${
          post.Comments.length
        } </div>
        </div></a>
        <div id="post-com" class="m-0 p-0">
        
        </div>
        
        <div class="card-footer">
        <div class="dropdown">
        <button class="btn dropdown-toggle" type="button" id="dropdownmenu" data-dropupAuto="false" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <i class="bi bi-chat-left-dots"></i> Commenter
        </button>
        <div class="dropdown-menu position-absolute col-11 col-md-11 px-4 py-2">
                <form>
                  <div class="form-group">
                  <label for="content"><i class="bi bi-chat-left-dots"></i></label>
                    <textarea type="text" minlength="3" class="form-control comTextArea" id="com-${
                      post.id
                    }" placeholder=" 3 caractères min. "></textarea>
                    </div>
                    </form>
                    <button class="btn postCom btn-com" data-pid="${
                      post.id
                    }">Commenter</button>
                    </div>
                    </div>
                    </div>
                    </div>
                    
                    `;
      }

      // **********VALIDATION TEXTAREA****************
      var regexContent = new RegExp("^[^<>{}~*]*$");
      var comText = document.getElementsByClassName("comTextArea");
      for (let i = 0; i < comText.length; i++) {
        comText[i].addEventListener("input", () => {
          var textContent = comText[i].value;
          var match = regexContent.test(textContent);
          if (!match) {
            comText[i].classList.add("invalid");
            para = document.createElement("p");
            para.innerHTML = ` <i class="bi bi-exclamation-circle-fill h5"></i>&nbsp; 3 caractères min. et caractères spéciaux interdits !`;
            para.setAttribute("class", "text-danger");
            para.classList.add("font-italic", "mt-3");
            if (comText[i].nextSibling) comText[i].nextSibling.remove();
            comText[i].parentNode.insertBefore(para, comText[i].nextSibling);
          } else {
            if (comText[i].nextSibling) comText[i].nextSibling.remove();
            comText[i].classList.remove("invalid");
          }
        });
      }
    })
    .join("");
};

// **********ajoute l'event listener sur chaque bouton de post com + fonction pour poster un com********
const addComment = async () => {
  await displayProductsList();

  let submit = document.getElementsByClassName("postCom");

  for (let i = 0; i < submit.length; i++) {
    submit[i].addEventListener("click", function () {
      let postId = this.dataset.pid;
      let route = "/api/posts/" + postId;
      let com = document.querySelector("#com-" + postId).value;
      let comObj = { content: com };

      fetch(apiUrl + route, {
        method: "POST",
        headers: new Headers(getheaders()),
        body: JSON.stringify(comObj),
      })
        .then((res) => {
          if (res.status == 201) {
            document.querySelector("#page-content").innerHTML = "";
            addComment();
          } else {
            document.querySelector("#com-" + postId).value = "";
            para = document.createElement("p");
            para.innerHTML = ` <i class="bi bi-exclamation-circle-fill h5"></i>&nbsp; 3 caractères min. et caractères spéciaux interdits !`;
            para.setAttribute("class", "text-danger");
            para.classList.add("font-italic", "mt-3");
            submit[i].parentNode.insertBefore(para, submit[i].nextSibling);
          }
        })
        .catch((error) => console.log(error));
    });
  }
};

addComment();
