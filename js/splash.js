window.addEventListener("load", function () {
  let dots = document.querySelectorAll(".dot");

  let interval = setTimeout(function () {
    for (let i = 0; i < dots.length; i++) {
      if (dots[i].textContent.length < 3) {
        dots[i].textContent += ".";
      } else {
        dots[i].textContent = ".";
      }
    }
  }, 500);

  setTimeout(function () {
    clearInterval(interval);
    document.getElementById("splash").style.display = "none";
  }, 3000);
});
