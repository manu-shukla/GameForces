if (localStorage.getItem("uid")) {
  let buttons = document.getElementsByClassName("loginbtn");

  for (let i = 0; i < buttons.length; ++i) {
    buttons[i].innerText = "My Account";
    buttons[i].onclick = () => window.open("./myaccount.html", "_self");
  }
}

function authy() {
  let provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      let credential = result.credential;

      // This gives you a Google Access Token. You can use it to access the Google API.
      let token = credential.accessToken;
      // The signed-in user info.

      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // User logged in already or has just logged in.

          localStorage.setItem("uid", `${user.uid}`);
          uid = user.uid;
          localStorage.setItem("username", user.displayName);
          localStorage.setItem("email", user.email);
          writeBasicInfo();
        } else {
          // User not logged in or has just logged out.
        }
      });

      let buttons = document.getElementsByClassName("loginbtn");

      for (let i = 0; i < buttons.length; ++i) {
        buttons[i].innerText = "My Account";
        buttons[i].onclick = () => window.open("./myaccount.html", "_self");
      }

      // ...
    })
    .catch((error) => {
      alert("Error :( The server did not respond. Click OK to reload.");
      window.location.reload();
    });
}
function writeBasicInfo() {
  let userExist;

  const dbRef = firebase.database().ref();
  dbRef
    .child("users")
    .child(localStorage.getItem("uid"))
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        userExist = true;
      } else {
        userExist = false;
        firebase
        .database()
        .ref("users/" + localStorage.getItem("uid"))
        .set({
          username: localStorage.getItem("username"),
          email: localStorage.getItem("email"),
        });
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });

}
