const pic = document.getElementsByClassName("img")[0]; 
const info = document.getElementsByClassName("info")[0]; 

pic.addEventListener("mouseenter", () => {
    info.style.display = "block"; 
});

pic.addEventListener("mouseleave", () => {
    info.style.display = "none"; 
});
