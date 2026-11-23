// Small niceties only — the site works fully without JS.
document.getElementById("year").textContent = new Date().getFullYear();

var toggle = document.getElementById("navToggle");
var nav = document.getElementById("nav");
toggle.addEventListener("click", function () {
  nav.classList.toggle("open");
});
nav.addEventListener("click", function (e) {
  if (e.target.tagName === "A") nav.classList.remove("open");
});
