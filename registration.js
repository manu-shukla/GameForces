if (!localStorage.getItem("uid")) {
  window.open("./index.html", "_self");
} else {
  let button = document.getElementById("navbtn");

  button.innerText = "My Account";
  button.onclick = () => window.open("./myaccount.html", "_self");
}

let url_string = document.location.toString();
let url = new URL(url_string);
let eventName = url.searchParams.get("eventname");

const dbRef = firebase.database().ref();
dbRef
  .child("event")
  .child(eventName)
  .get()
  .then((snapshot) => {
    if (snapshot.exists()) {
      document.getElementById("eventFee").innerText = `Event Fees: ₹ ${
        snapshot.val().entryfee
      } only`;
      document.getElementById("loader").style.display = "none";
    } else {
      console.log("No data available");
    }
  })
  .catch((error) => {
    console.error(error);
    alert("Error :( The server did not respond. Click OK to reload.");
    window.location.reload();
  });

document.getElementById(
  "eventTitle"
).innerText = `Event Name: ${eventName.toUpperCase()}`;

let uploader = document.getElementById("progress");
let fileButton = document.getElementById("uploaded");
let timestamp = Date.now();
fileButton.addEventListener("change", (e) => {
  let file = e.target.files[0];

  let storageRef = firebase
    .storage()
    .ref("receipts/" + localStorage.getItem("uid") + "/" + timestamp);

  let task = storageRef.put(file);

  task.on(
    "state_changed",

    function progress(snapshot) {
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      percentage = Math.floor(percentage);

      uploader.innerText = `${percentage}%`;
      uploader.style.width = `${percentage}%`;
    },

    function errors(err) {},

    function complete() {}
  );
});
function register() {
  if (uploader.innerText != "100%") {
    alert("Reciept Not Uploaded. Kindly Upload it completely");
    return;
  }
  let receipturl;
  let username = document.getElementById("username").value;
  let useremail = document.getElementById("useremail").value;
  let gamename = document.getElementById("gamename").value;

  firebase
    .database()
    .ref(
      "forVerification/" +
        `${eventName}/` +
        localStorage.getItem("uid") +
        "/" +
        timestamp
    )
    .set({
      username: username,
      email: useremail,
      gamehandle: gamename,
      reciept_url: `https://firebasestorage.googleapis.com/v0/b/gamingportal-ccd0c.appspot.com/o/receipts%2F${localStorage.getItem(
        "uid"
      )}%2F${timestamp}?alt=media`,
      eventName: eventName,
      date: `${Date()}`,
    });
  firebase
    .database()
    .ref(`users/${localStorage.getItem("uid")}/myorders/` + timestamp)
    .set({
      username: username,
      email: useremail,
      gamehandle: gamename,
      receipt_url: `https://firebasestorage.googleapis.com/v0/b/gamingportal-ccd0c.appspot.com/o/receipts%2F${localStorage.getItem(
        "uid"
      )}%2F${timestamp}?alt=media`,
      eventName: eventName,
      date: `${new Date().toISOString().split("T")[0]}`,
      status: "Pending Verification",
    });

  let myToastEl = document.getElementById("mytoast");
  let myToast = bootstrap.Toast.getOrCreateInstance(myToastEl);

  myToast.show();
  let audio = new Audio("sent.wav");
  audio.play();
  setTimeout(() => window.open("./myaccount.html", "_self"), 7000);
}
