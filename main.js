window.onload = function removeLoader() {
  setTimeout(removeNow, 8000);
};

function removeNow() {
  document.getElementById("mainload").style.display = "none";
}
