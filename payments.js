let timestamp = Date.now();

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}
console.log(
  document.getElementById("username").value,
  document.getElementById("useremail").value
);

function processPayment() {
  let username = document.getElementById("username").value;
  let useremail = document.getElementById("useremail").value;
  let gamename = document.getElementById("gamename").value;
  if (validateEmail(useremail) && username != "" && gamename != "") {
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
    Swal.fire({
      title: "Check Input Fields",
      text: "Some of the input field(s) are incorrectly typed!",
      icon: "question",
      confirmButtonText: "Enter Again",
      allowOutsideClick: false,
    });
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

  Swal.fire({
    title: "Payment Failure",
    html: `Sorry Your Payment Failed! If any Amount is deducted then it will be refunded to you.<br><br> OrderID : ${timestamp}<br><br> Please note your Order ID for future reference.`,
    icon: "error",
    confirmButtonText: "Go Back",
    allowOutsideClick: false,
  }).then(function () {
    window.location.href = "./myaccount.html";
  });
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
  if (referralCodeApplied) {
    firebase
      .database()
      .ref()
      .child(`referrals/${referralCode}`)
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          let updates = { count: snapshot.val().count + 1 };
          firebase
            .database()
            .ref(`referrals/${referralCode}`)
            .update(updates, (error) => {
              if (error) {
                console.log(error);
              } else {
              }
            });
        } else {
          let updates = { count: 1 };
          firebase
            .database()
            .ref(`referrals/${referralCode}`)
            .update(updates, (error) => {
              if (error) {
                console.log(error);
              } else {
              }
            });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  Swal.fire({
    title: "Payment Successful",
    text: "Payment Done Successfully!",
    icon: "success",
    confirmButtonText: "Done",
    allowOutsideClick: false,
  }).then(function () {
    window.location.href = "./myaccount.html";
  });
}
