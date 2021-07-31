if (!localStorage.getItem("uid")) {
  window.open("./index.html", "_self");
} else {
  let button = document.getElementById("navbtn");

  button.innerText = "My Account";
  button.onclick = () => window.open("./myaccount.html", "_self");
}
var eventPrice = 0;
var referralCode = "";
var referralCodeApplied = false;

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
    Swal.fire({
      title: "Error!",
      text: "The Server Did not respond",
      icon: "error",
      confirmButtonText: "Reload",
      allowOutsideClick: false,
    }).then(function () {
      window.location.reload();
    });
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

          referralCode = snapshot.val().refCode;
          referralCodeApplied = true;
          Swal.fire({
            title: "Referral Code Applied",
            text: "Referral Code Applied! Check New Event Price",
            icon: "success",
            confirmButtonText: "Done",
            allowOutsideClick: false,
          });
        } else {
          Swal.fire({
            title: "Alert!",
            text: "The Code entered is either INVALID or EXPIRED",
            icon: "info",
            confirmButtonText: "Retry",
            allowOutsideClick: false,
          });
        }
      } else {
        Swal.fire({
          title: "Alert!",
          text: "The Code entered is either INVALID or EXPIRED",
          icon: "info",
          confirmButtonText: "Retry",
          allowOutsideClick: false,
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
