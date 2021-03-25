// ***************AFFICHAGE**************
const fetchProfile = async () => {
  profile = await fetch(apiUrl + "/api/auth/" + userId, {
    method: "get",
    headers: new Headers(getheaders()),
  })
    .then((res) => res.json())
    .catch((error) => console.log(error));
  console.log(profile);
  return profile;
};

const displayProfile = async () => {
  await fetchProfile();

  document.getElementById("page-content").innerHTML = `
    <div id="adminbuttons" class="animate__animated animate__fadeIn animate__slow">
    
    <div class="d-flex align-items-center justify-content-center mt-4">
    <button aria-label="editer le profil" class="btn btn-com editpost mr-3" id="editpost"> <i class="bi bi-pencil"></i> Modifier </button>
        <button aria-label="supprimer le profil" class="btn btn-com deletepost ml-3" id="deletepost"> <i class="bi bi-trash"></i> Supprimer </button>
        </div>
        
        </div>
        

        <div id="profile">
        
        <div class="card gedf-card col-md-8 mx-auto mt-4 dropshadow-sm animate__animated animate__fadeIn">
        <div class="card-header d-flex flex-column align-items-center pl-3 p-0">
        <div class="m-2 pb-4">
        <i class="bi bi-person-circle profile-pic"></i>
        </div>
        </div>
        <div class="card-body p-3">
        <form id="profileform">
        <label class="fadeInDown" for="username">Nom d'utilisateur : </label>
        <input class="fadeIn" name="profile" type="text" id="username" placeholder="${
          profile.username
        }" readonly>
        <label class="fadeInDown first" for="email">Adresse email : </label>
        <input class="fadeIn first" name="profile" type="email" id="email" placeholder="${
          profile.email
        }" readonly>
        <div id="oldpass">
        </div>
        <label class="fadeInDown second" for="password"> Mot de passe : </label>
          <input class="fadeIn second" name="profile" type="password" id="password" placeholder="********" readonly>
        </form>
        </div>

        <div class="card-footer">
        <div class="text-muted profile-createdat" role="image" alt="date de création du profil" title="date de création du profil">
        <p><i class="bi bi-clock"></i> ${updatedAtFormat(
          profile.createdAt
        )}</p></div>
        <div class="text-muted profile-posts" role="image" alt="nombre de posts créés" title="nombre de posts créés">
        <p><i class="bi bi-chat-left-dots"></i> ${
          profile.Posts.length
        }</p></div>
        </div>
        </div>

        <div id="editmode">
            
        </div>
        
        </div>
        
        `;
};

const manageProfile = async () => {
  await displayProfile();

  document.getElementById("deletepost").addEventListener("click", function () {
    console.log("piiip");
    fetch(apiUrl + "/api/auth/" + userId, {
      method: "DELETE",
      headers: new Headers(getheaders()),
    })
      .then((res) => {
        if (res.status == 200) {
          sessionStorage.clear();
          window.location.assign("index.html");
        }
      })
      .catch((error) => console.log(error));
  });

  document.getElementById("editpost").addEventListener("click", function () {
    console.log("pipou");
    // ajoute champ oldpass
    document.getElementById("oldpass").innerHTML = `
    <label class="fadeInDown second" for="oldpassword"> Ancien mot de passe : </label>
          <input class="fadeIn" name="profile" type="password" id="oldpassword" placeholder="votre mdp actuel" readonly>
    `;
    // modif placeholder password
    document
      .getElementById("password")
      .setAttribute("placeholder", "votre nouveau mdp");
    // ajoute le btn pour envoyer la requete
    document.getElementById("editmode").innerHTML = `
    <div class="d-flex align-items-center justify-content-center mt-4">
        <button aria-label="editer le profil" class="btn btn-com editpost p-3" id="savechanges"> <i class="bi bi-check-square mr-2"></i> Sauvegarder </button>
    </div>
    `;

    inputs = document.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].removeAttribute("readonly");
    }

    document
      .getElementById("savechanges")
      .addEventListener("click", function () {
        let username = document.getElementById("username");
        let email = document.getElementById("email");
        let password = document.getElementById("password");
        let oldpassword = document.getElementById("oldpassword");

        if (checkForm()) {
          let userObj = {
            username: username.value,
            email: email.value,
            oldpassword: oldpassword.value,
            password: password.value,
          };

          fetch(apiUrl + "/api/auth/" + userId, {
            method: "PUT",
            headers: new Headers(getheaders()),
            body: userObj,
          })
            .then((res) => {
              if (res.status == 200) {
                window.location.assign("profil.html?id=" + userId);
              }
            })
            .catch((error) => console.log(error));
        }
      });
  });
};

manageProfile();
