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
function animationText() {
  const fxTitle = document.querySelectorAll("[data-splitting]");

  fxTitle.forEach((element) => {
    const chars = element.querySelectorAll(".char");

    // Tạo timeline cho animation
    const tl = gsap.timeline({ paused: true }).to(chars, {
      color: "red",
      stagger: 0.05, // Delay giữa các ký tự
      duration: 0.2, // Thời gian đổi màu mỗi ký tự
    });

    // Hover events
    element.addEventListener("mouseenter", () => {
      tl.restart(); // Chạy animation khi hover
    });

    element.addEventListener("mouseleave", () => {
      gsap.to(chars, {
        color: "black",
        stagger: 0.05,
        duration: 0.2,
      });
    });
  });
}
const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  animationMaskCentral();
  animationText();
};
preloadImages("img").then(() => {
  // Once images are preloaded, remove the 'loading' indicator/class from the body

  init();
});
$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
