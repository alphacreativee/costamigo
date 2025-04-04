import { preloadImages } from "../../libs/utils.js";
let lenis;
Splitting();

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
};
preloadImages("img").then(() => {
  // Once images are preloaded, remove the 'loading' indicator/class from the body

  init();
});
$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
