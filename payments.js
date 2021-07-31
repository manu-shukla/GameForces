let timestamp = Date.now();

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

function processPayment() {
  let username = document.getElementById("username").value;
  let useremail = document.getElementById("useremail").value;
  let gamename = document.getElementById("gamename").value;
  if (validateEmail(useremail) && username != null && gamename != null) {
    var options = {
      key: "rzp_live_oOCcWqrSW5VfsL", // Enter the Key ID generated from the Dashboard
      amount: eventPrice * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Ashirwad Games",
      description: `Payment For the Event: ${eventName.toUpperCase()}`,
      image: "./logomini.png",

      handler: function (response) {
        finalizePayment(response);
      },
      prefill: {
        name: username,
        email: useremail,
        contact: "9999999999",
      },
      notes: {
        orderID: timestamp,
        username: username,
        useremail: useremail,
        gamehandle: gamename,
      },
      theme: {
        color: "#800080",
      },
      modal: {
        ondismiss: function () {
          failedPayment();
        },
      },
    };
    var rzp1 = new Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      rzp1.close();
    });
    rzp1.open();
  } else {
    alert("Something Wrong!");
  }
}
function failedPayment() {
  let username = document.getElementById("username").value;
  let useremail = document.getElementById("useremail").value;
  let gamename = document.getElementById("gamename").value;
  firebase
    .database()
    .ref(`users/${localStorage.getItem("uid")}/myorders/` + timestamp)
    .set({
      username: username,
      email: useremail,
      gamehandle: gamename,
      eventName: eventName,
      date: `${new Date().toISOString().split("T")[0]}`,

      status: "FAILED",
    });

  alert(
    `Sorry Your Payment Failed! If any Amount is deducted then it will be refunded to you. Please note your Order ID for future reference. OrderID : ${timestamp}`
  );

  window.location.href = "./myaccount.html";
}

function finalizePayment(response) {
  let username = document.getElementById("username").value;
  let useremail = document.getElementById("useremail").value;
  let gamename = document.getElementById("gamename").value;
  let userID = localStorage.getItem("uid");
  firebase
    .database()
    .ref(`users/${userID}/myorders/` + timestamp)
    .set({
      username: username,
      email: useremail,
      gamehandle: gamename,
      eventName: eventName,
      date: `${new Date().toISOString().split("T")[0]}`,
      razorpay_id: response.razorpay_payment_id,
      status: "SUCCESS",
    });

  firebase
    .database()
    .ref()
    .child("event")
    .child(`${eventName}/participants`)
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        let participantsList = snapshot.val();
        participantsList.push(userID);
        setData(participantsList, eventName);
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function setData(participantsList, eventName) {
  firebase
    .database()
    .ref(`event/${eventName}/participants`)
    .set(participantsList);
  redirectUser();
  return;
}
function redirectUser() {
  alert("Payment Successful!");
  window.location.href = "./myaccount.html";
}
