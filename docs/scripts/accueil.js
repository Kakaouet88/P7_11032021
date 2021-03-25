// ***************FETCH*************
let posts;

const fetchProducts = async () => {
  posts = await fetch(apiUrl + "/api/posts", {
    method: "get",
    headers: new Headers(getheaders()),
  })
    .then((res) => res.json())
    .catch((error) => {
      alert(error);
    });
  console.log(posts);
  return posts;
};

// **************************PAGE INDEX******************************

// AFFICHER LA LISTE DES ARTICLES SUR LA PAGE ACCUEIL

const displayProductsList = async () => {
  await fetchProducts();

  document.getElementById("page-content").innerHTML = posts
    .map(
      (post) =>
        `
        <div class="card gedf-card col-md-8 mx-auto mt-3 dropshadow-sm animate__animated animate__fadeInUp">
        <div class="card-header d-flex align-items-center pl-3 p-0">
                    <a href="./profil.html?id=${
                      post.UserId
                    }" title="voir profil"><div class="mr-2 pb-2">
                        <i class="bi bi-person-circle post-pic"></i>
                    </div></a>
                    <div class="ml-2">
                        <div class="post-username m-0"> ${
                          post.User.username
                        } </div>
                    </div>
        </div>
        <a href="./post.html?id=${
          post.id
        }" class="postlink" title="voir post"><div class="card-body py-2">
            <p class="font-weight-bold">${post.title}</p>
            <p class="card-text">${post.content}</p>
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
                <form></form>
                  <div class="form-group">
                    <label for="content"><i class="bi bi-chat-left-dots"></i></label>
                    <textarea type="text" class="form-control" id="com-content" placeholder=" wow ! "></textarea>
                  </div>
                  <button class="btn postCom btn-com" data-pid="${
                    post.id
                  }">Commenter</button>
                </form>
              </div>
        </div>
        </div>
    </div>

    `
    )
    .join("");
};

// **********ajoute l'event listener sur chaque bouton de post com + fonction pour poster un com********
const addComment = async () => {
  await displayProductsList();

  let submit = document.getElementsByClassName("postCom");

  for (let i = 0; i < submit.length; i++) {
    submit[i].addEventListener("click", function () {
      let postId = this.dataset.pid;
      const route = "/api/posts/" + postId;
      console.log(route);
      let com = document.getElementById("com-content").value;
      let comObj = { content: com };
      console.log(comObj);

      xhrpost(comObj, route).then(() => displayProductsList());
    });
  }
};

addComment();
