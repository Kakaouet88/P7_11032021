// *************page post*************

// ***************FETCH*************
let post;
let param = new URL(window.location).searchParams;
let postId = param.get("id");

const fetchProducts = async () => {
  post = await fetch(apiUrl + "/api/posts/" + postId, {
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

const displayProductsList = async () => {
  await fetchProducts();

  document.getElementById("bannertext").innerHTML = `
  <p>${post.User.username} :</p>${post.title}
  `;

  document.getElementById("post").innerHTML = `
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
        <div class="card-body py-2">
            <p class="font-weight-bold">${post.title}</p>
            <p class="card-text">${post.content}</p>
            <div class="text-muted post-createdat h6">  <i class="bi bi-clock"></i> ${updatedAtFormat(
              post.updatedAt
            )} &nbsp;&nbsp;&nbsp;<i class="bi bi-chat-left-dots"></i> ${
    post.Comments.length
  } </div>
        </div>
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

    `;

  post.Comments.map((com) => {
    if (com.UserId == userId || isAdmin) {
      document.querySelector("#post-com").innerHTML += `
          <hr class="p-0 m-0">
          <div class="card-com card-body animate__animated animate__fadeInLeft">
              <p id="com-username"><a href="./profil.html?id=${com.UserId}">${
        com.User.username
      }</a><span class="ml-2 text-muted post-createdat"> ${updatedAtFormat(
        com.createdAt
      )}</span></p>
              <div class="px-3 py-2 m-0 com-content">${
                com.content
              }<i data-cid="${com.id}" class="bi bi-trash removeCom"></i></div>
          </div>
          `;
    } else {
      document.querySelector("#post-com").innerHTML += `
          <hr class="p-0 m-0">
          <div class="card-com card-body animate__animated animate__fadeInLeft">
              <p id="com-username"><a href="./profil.html?id=${com.UserId}">${
        com.User.username
      }</a><span class="ml-2 text-muted post-createdat"> ${updatedAtFormat(
        com.createdAt
      )}</span></p>
              <div class="px-3 py-2 m-0 com-content">${com.content}</div>
          </div>
          `;
    }
  }).join("");

  if (post.UserId == userId) {
    document.getElementById("adminbuttons").innerHTML = `
        <div class="d-flex align-items-center justify-content-center mt-4">
        <button aria-label="editer le profil" class="btn btn-com editpost mr-3" id="editpost"> <i class="bi bi-pencil"></i> Modifier </button>
            <button aria-label="supprimer le profil" class="btn btn-com deletepost ml-3" id="deletepost"> <i class="bi bi-trash"></i> Supprimer </button>
            </div>
        `;
  } else if (isAdmin) {
    document.getElementById("adminbuttons").innerHTML = `
        <div class="d-flex align-items-center justify-content-center mt-4">
        <button aria-label="supprimer le profil" class="btn btn-com deletepost ml-3" id="deletepost"> <i class="bi bi-trash"></i> Supprimer </button>
            </div>
        `;
    document.getElementById("bannertext").innerHTML = `
        ${post.User.username} : <br> ${post.title} <br> (mode administrateur)
        `;
  }
};

// ********** supprimer et poster coms********
const manageComment = async () => {
  await displayProductsList();

  //   ****************ADD COM************
  let submit = document.getElementsByClassName("postCom");
  for (let i = 0; i < submit.length; i++) {
    submit[i].addEventListener("click", function () {
      let postId = this.dataset.pid;
      const route = "/api/posts/" + postId;
      console.log(route);
      let com = document.getElementById("com-content").value;
      let comObj = { content: com };
      console.log(comObj);

      xhrpost(comObj, route).then(() => managePost());
    });
  }

  // *************REMOVE COM***************
  let removeCom = document.getElementsByClassName("removeCom");
  for (let i = 0; i < removeCom.length; i++) {
    removeCom[i].addEventListener("click", function () {
      let comId = this.dataset.cid;
      console.log("piiip");
      fetch(apiUrl + "/api/posts/com/" + comId, {
        method: "DELETE",
        headers: new Headers(getheaders()),
      })
        .then((res) => {
          if (res.status == 200) {
            managePost();
          }
        })
        .catch((error) => console.log(error));
    });
  }
};

const managePost = async () => {
  await manageComment();

  //   ****************DELETE POST*****************
  document.getElementById("deletepost").addEventListener("click", function () {
    console.log("piiip");
    fetch(apiUrl + "/api/posts/" + postId, {
      method: "DELETE",
      headers: new Headers(getheaders()),
    })
      .then((res) => {
        if (res.status == 200) {
          window.location.assign("accueil.html");
        }
      })
      .catch((error) => console.log(error));
  });

  document.getElementById("editpost").addEventListener("click", function () {
    console.log("bipbip");
    window.location.assign("createpost.html?id=" + postId);
  });
};

managePost();
