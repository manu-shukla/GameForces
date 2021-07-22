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


firebase
  .database()
  .ref(`event/${eventName}/winners`)
  .on("value", (snapshot) => {
    let container = document.getElementById("winnerbody");
    container.innerHTML = "";
    for (let [index, winner] of snapshot.val().entries()) {
      console.log(winner);
      let winnerDetail = document.createElement("tr");
      let rank = document.createElement("td");
      let name = document.createElement("td");
      let gameHandle = document.createElement("td");
      let eventname = document.createElement("td");
      let kills = document.createElement("td");

      rank.innerText = index + 1;
      name.innerText = winner.name;
      gameHandle.innerText = winner.gamehandle;
      eventname.innerText = winner.eventname;
      kills.innerText = winner.kills;

      winnerDetail.appendChild(rank);
      winnerDetail.appendChild(name);
      winnerDetail.appendChild(gameHandle);
      winnerDetail.appendChild(eventname);
      winnerDetail.appendChild(kills);
      container.appendChild(winnerDetail);
      setTimeout(hideLoader, 3000);
    }
  });

function hideLoader() {
  document.getElementById("loader").style.display = "none";
  return;
}
