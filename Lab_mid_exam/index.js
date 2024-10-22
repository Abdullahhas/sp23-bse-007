const pic = document.getElementsByClassName("img")[0]; // Get the first .img element
const info = document.getElementsByClassName("info")[0]; // Get the first .info element

pic.addEventListener("mouseenter", () => {
    info.style.display = "block"; // Show the info on mouse enter
});

pic.addEventListener("mouseleave", () => {
    info.style.display = "none"; // Hide the info on mouse leave
});
