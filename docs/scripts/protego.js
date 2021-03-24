// **********VERIFICATION LOGGEDIN***************
let apiUrl = "http://localhost:3000";

const verifyLog = async () => {
  await fetch(apiUrl + "/api/posts", { method: "GET" }).then((res) => {
    if (!res.headers.authorization) {
      console.log(res);
      window.location.assign("index.html");
    }
  });
};
verifyLog();
