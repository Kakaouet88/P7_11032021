// **********VERIFICATION LOGGEDIN***************

const verifyLog = async () => {
  if (!userId) {
    window.location.assign("index.html");
  }
};

verifyLog();
