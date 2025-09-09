document.addEventListener("DOMContentLoaded", () => {
    const menu = document.querySelector(".menu-list");
    const btnLeft = document.querySelector(".scroll-btn.left");
    const btnRight = document.querySelector(".scroll-btn.right");

    const scrollAmount = 200; // píxeles a desplazar en cada click

    btnLeft.addEventListener("click", () => {
        menu.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    btnRight.addEventListener("click", () => {
        menu.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
});

function checkButtons() {
    btnLeft.disabled = menu.scrollLeft <= 0;
    btnRight.disabled = menu.scrollLeft + menu.clientWidth >= menu.scrollWidth;
}
menu.addEventListener("scroll", checkButtons);
window.addEventListener("resize", checkButtons);
checkButtons(); // inicial
