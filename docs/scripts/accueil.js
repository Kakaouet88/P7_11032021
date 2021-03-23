// ***************FETCH*************
let apiUrl = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
? "http://localhost:3000"
: "https://orinoco-p5-nonorgue.herokuapp.com"

let products;

const fetchProducts = async () => {
  products = await fetch(apiUrl + "/api/teddies").then((res) =>
    res.json()
    ).catch((error) => {alert(error)});
  console.log(products);
  return products;
};

// **************************PAGE INDEX******************************

// AFFICHER LA LISTE DES ARTICLES SUR LA PAGE ACCUEIL

const displayProductsList = async () => {
  await fetchProducts();

  document.getElementById("productsList").innerHTML = products
    .map(
      (product) =>
      
        `
        <a href="../Frontend/product.html?id=${product._id}" class="text-decoration-none text-reset col-md-4 my-4 productLink" id="${product._id}">
          <div class="card shadow-sm mx-3" style="height : 70vh; max-height: 500px; min-height: 370px">
            <img class="card-img-top" src=${product.imageUrl} alt="Card image cap">
            <div class="card-body">
              <h5 class="cardProductName">${product.name}</h5>
              <p class="cardProductDescription">${product.description}</p>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item cardProductPrice font-weight-bold">${numberWithCommas(product.price)} €</li>
              <li class="list-group-item cardProductColors">${product.colors.length} choix de couleur</li>
            </ul>
          </div>
        </a>

    `
    )
    .join("");
};

displayProductsList();