import { preloadImages } from "../../libs/utils.js";
let lenis;
Splitting();

function sectionSlider() {
  const slide = document.querySelectorAll(".swiper-slide");

  const swiperOptions = {
    loop: "infinite",
    effect: "fade",
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    // custom pagination
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      renderBullet: function (i, className) {
        return `
          <button class="${className}">
            <svg class="progress" width="41" height="41"><circle class="circle-origin" r="20" cx="20.5" cy="20.5"></circle></svg>
            <span>${i + 1}</span>
          </button>`;
      }
    }
  };

  const swiper = new Swiper(".swiper", swiperOptions);
}

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  sectionSlider();
};

preloadImages("img").then(() => {
  // Once images are preloaded, remove the 'loading' indicator/class from the body

  init();
});

$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
