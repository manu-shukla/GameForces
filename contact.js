if (localStorage.getItem("uid")) {
  let button = document.getElementById("navbtn");

  button.innerText = "My Account";
  button.onclick = () => window.open("./myaccount.html", "_self");
}

function submitForm() {
  if (!localStorage.getItem("uid")) {
    alert("Kindly Login First To contact us");
    return;
  }
  let myToastEl = document.getElementById("mytoast");
  let myToast = bootstrap.Toast.getOrCreateInstance(myToastEl);

  myToast.show();
  let audio = new Audio("sent.wav");
  audio.play();
  setTimeout(() => window.location.reload(), 3000);

  let username = document.getElementById("username").value;
  let useremail = document.getElementById("useremail").value;
  let message = document.getElementById("message").value;
  firebase
    .database()
    .ref("contact/" + localStorage.getItem("uid"))
    .set({
      username: username,
      email: useremail,
      user_message: message,
    });
}
