import { preloadImages } from "../../libs/utils.js";
let lenis;
Splitting();

function animationMaskCentral() {
  const animationImages = document.querySelectorAll(".animation-image");

  animationImages.forEach((image) => {
    gsap.to(image, {
      scrollTrigger: {
        trigger: image,
        start: "top 50%",
        end: "bottom 50%",
        // toggleClass: "show",
        onEnter: () => image.classList.add("show"),
        markers: true,
      },
    });
  });
}
const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  animationMaskCentral();
};
preloadImages("img").then(() => {
  // Once images are preloaded, remove the 'loading' indicator/class from the body

  init();
});
$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
