if (!localStorage.getItem("uid")) {
  window.open("./index.html", "_self");
} else {
  let button = document.getElementById("navbtn");

  button.innerText = "My Account";
  button.onclick = () => window.open("./myaccount.html", "_self");
}
var eventPrice = 0;


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
      eventPrice = snapshot.val().entryfee;
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



function setReferral() {
  let code = document.getElementById("refCode").value;

  const dbRef = firebase.database().ref();
  dbRef
    .child("event")
    .child(`${eventName}`)
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        if (snapshot.val().refCode == code) {
          let refSection = document.getElementById("refSection");
          refSection.innerHTML = `<h5 style="color: purple;"><span style ="color: green">Referral Code Applied!</span> Check New Event Price</h5>`;
          eventPrice = snapshot.val().refFee;
          document.getElementById("eventFee").innerText = `Event Fees: ₹${
            snapshot.val().refFee
          } only`;
        } else {
          alert("The Code entered is either INVALID or EXPIRED");
        }
      } else {
        console.log("Invalid Referral Code");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
