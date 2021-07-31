if (localStorage.getItem("uid")) {
  let button = document.getElementById("navbtn");

  button.innerText = "My Account";
  button.onclick = () => window.open("./myaccount.html", "_self");
}

function fetchData(events) {
  for (let i = 0; i < events.length; ++i) {
    let eventName = events[i];
    const dbRef = firebase.database().ref();
    dbRef
      .child("event")
      .child(eventName)
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          setCountdown(snapshot.val().timing, eventName);
          setDescription(snapshot.val().description, eventName);

          if (i == events.length - 1) {
            document.getElementById("loader").style.display = "none";
          }
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
        if (i == events.length - 1) {
          Swal.fire({
            title: "Error!",
            text: "The Server Did not respond",
            icon: "error",
            confirmButtonText: "Reload",
            allowOutsideClick: false,
          }).then(function () {
            window.location.reload();
          });
        }
      });
  }
}

function setCountdown(eventTiming, eventName) {
  let countDownDate = new Date(eventTiming).getTime();

  let x = setInterval(function () {
    let now = new Date().getTime();

    let distance = countDownDate - now;

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById(`${eventName}Timing`).innerHTML =
      days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

    if (distance < 0) {
      clearInterval(x);
      document.getElementById(`${eventName}Timing`).innerHTML = "Event Ended";
    }
  }, 1000);
}
function setDescription(description, eventName) {
  document.getElementById(`${eventName}Des`).innerHTML = description;
}

window.onload = fetchData(["codm", "pubg", "freefire"]);
