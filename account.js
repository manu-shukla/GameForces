if (!localStorage.getItem("uid")) {
  window.open("./index.html", "_self");
} else {
  let button = document.getElementById("navbtn");

  button.innerText = "My Account";
  button.onclick = () => window.open("./myaccount.html", "_self");
}
function logout() {
  let confirmation = confirm("Are you Sure You Want to Logout?");
  if (confirmation) {
    localStorage.removeItem("uid");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    window.open("./index.html", "_self");
    return;
  }
}

document.getElementById(
  "welcomehead"
).innerText = `Welcome ${localStorage.getItem("username")}!`;

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
          let eventEnded;
          setCountdown(snapshot.val().timing, eventName);
          if (eventStatus(snapshot.val().timing, eventName)) {
            eventEnded = true;
          } else {
            eventEnded = false;
          }
          setDescription(snapshot.val().description, eventName);
          let registeredUsers = snapshot.val().participants;
          if (eventName != "freefire") {
            let count = document.getElementById(`${eventName}users`);
            count.innerText = `${
              registeredUsers.length - 2
            }/100 Users Joined`;
            count.style.fontWeight = "bold";
          } else {
            let count = document.getElementById(`${eventName}users`);
            count.innerText = `${registeredUsers.length - 2}/50 Users Joined`;
            count.style.fontWeight = "bold";
          }
          if (
            registeredUsers.length == 102 &&
            eventEnded == false &&
            eventName != "freefire"
          ) {
            let button = document.getElementById(`${eventName}Register`);
            button.innerText = "Sorry Room Capacity Exceeded!";
            button.style.backgroundColor = "grey";
            button.href = "#";
          } else if (
            registeredUsers.length == 52 &&
            eventEnded == false &&
            eventName == "freefire"
          ) {
            let button = document.getElementById(`${eventName}Register`);
            button.innerText = "Sorry Room Capacity Exceeded!";
            button.style.backgroundColor = "grey";
            button.href = "#";
          } else if (
            registeredUsers.includes(localStorage.getItem("uid")) &&
            eventEnded == false
          ) {
            let button = document.getElementById(`${eventName}Register`);
            button.innerText = "Already Registered";
            button.style.backgroundColor = "grey";
            button.href = "#";
           
            let modalButton = document.getElementById(`${eventName}modal`);
            modalButton.style.display = "";
            modalButton.onclick = function fun() {
              toggleModal(`${eventName}`);
            };
          }
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
          alert("Error :( The server did not respond. Click OK to reload.");
          window.location.reload();
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

      document.getElementById(
        `${eventName}Register`
      ).href = `./winners.html?eventname=${eventName}`;
      document.getElementById(`${eventName}Register`).innerText =
        "Winners/Claim Prize";
      document.getElementById(`${eventName}Register`).className =
        "btn btn-info";
    }
  }, 1000);
}
function setDescription(description, eventName) {
  document.getElementById(`${eventName}Des`).innerHTML = description;
}

window.onload = fetchData(["codm", "pubg", "freefire"]);
function fetchMyOrders() {
  // const dbRef = firebase.database().ref();
  // dbRef
  //   .child(`users/${localStorage.getItem("uid")}/myorders`)
  //   .get()
  //   .then((snapshot) => {
  //     if (snapshot.exists()) {
  //       console.log(snapshot.val());
  //       viewOrders(snapshot.val());
  //     } else {
  //       console.log("No data available");
  //     }
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });

  // New Code
  let myOrders = firebase
    .database()
    .ref(`users/${localStorage.getItem("uid")}/myorders`);
  myOrders.on("value", (snapshot) => {
    const data = snapshot.val();
    viewOrders(snapshot.val());
  });
}
window.onload = fetchMyOrders();

function viewOrders(myorders) {
  let ordertable = document.getElementById("orderhistory");
  ordertable.innerHTML = ` <tr>
<th>Order ID#</th>
<th>Order Date</th>
<th>Event Name</th>
<th>Status</th>
</tr>`;

  const entries = Object.entries(myorders);

  for (let i = 0; i < entries.length; ++i) {
    let row = document.createElement("tr");
    let orderid = document.createElement("td");
    let orderdate = document.createElement("td");
    let eventname = document.createElement("td");
    let status = document.createElement("td");
   
    row.className = "table-success";

    // For Order ID

    orderid.innerText = entries[i][0];
    row.appendChild(orderid);

    // For Order Date

    orderdate.innerText = entries[i][1].date;
    row.appendChild(orderdate);

    // For Event Name

    eventname.innerText = entries[i][1].eventName.toUpperCase();
    row.appendChild(eventname);

    // For Order Status

    status.innerText = entries[i][1].status;
    row.appendChild(status);

    

    // Final Appending to Table

    ordertable.appendChild(row);
  }
}

function toggleModal(eventName) {
  if (
    document.getElementById(`${eventName}Register`).innerText !=
    "Already Registered"
  ) {
    return;
  }
  let modalBody = document.getElementById("modalBody");
  modalBody.innerHTML = "";
  const dbRef = firebase.database().ref();
  dbRef
    .child("event")
    .child(`${eventName}/joining`)
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        let roomid = document.createElement("h4");
        let roompass = document.createElement("h4");
        roomid.innerText = `Room ID: ${snapshot.val().roomid}`;
        roompass.innerText = `Room Password: ${snapshot.val().roompass}`;
        modalBody.appendChild(roomid);
        modalBody.appendChild(roompass);

        let myModal = new bootstrap.Modal(document.getElementById("myModal"));
        myModal.toggle();
      } else {
        console.log("No data available");
        alert("Unable To Fetch Joining Details. Please Try Again Later!");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function eventStatus(eventTiming, eventName) {
  let countDownDate = new Date(eventTiming).getTime();

  let now = new Date().getTime();

  let distance = countDownDate - now;

  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);

  if (distance < 0) {
    return true;
  }
  return false;
}
