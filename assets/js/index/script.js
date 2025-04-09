import { preloadImages } from "../../libs/utils.js";
let lenis;
Splitting();

function sectionSlider() {
  if ($(".section-slider").length < 1) return;

  const sections = document.querySelectorAll(".tab-content .tab-pane");

  sections.forEach((section) => {
    const contentSwiperEl = section.querySelector(".slider-swiper-content");
    const mainSwiperEl = section.querySelector(".main-slider");
    const paginationEl = section.querySelector(".swiper-pagination");

    const swiperContent = new Swiper(contentSwiperEl, {
      loop: false,
      effect: "fade",
      allowTouchMove: false,
    });

    const swiperMain = new Swiper(mainSwiperEl, {
      loop: true,
      effect: "fade",
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: paginationEl,
        clickable: true,
        renderBullet: function (i, className) {
          return `
            <button class="${className}">
              <svg class="progress" width="41" height="41"><circle class="circle-origin" r="20.5" cx="20.5" cy="20.5"></circle></svg>
              <span>${i + 1}</span>
            </button>`;
        },
      },
      on: {
        slideChange: function () {
          const realIndex = this.realIndex;
          swiperContent.slideTo(realIndex);
        },
      },
    });
  });
}

function imgWithText() {
  if ($(".image-with-text").length < 1) return;

  gsap.registerPlugin(ScrollTrigger);

  gsap.to(".mask.top", {
    y: "-100%",
    duration: 1.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".image-with-text",
      start: "top top",
      toggleActions: "play none none none",
      // markers: true
    },
  });

  gsap.to(".mask.bottom", {
    y: "100%",
    duration: 1.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".image-with-text",
      start: "top top",
      toggleActions: "play none none none",
      // markers: true
    },
  });
}

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
        // markers: true
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
function swiperRestaurant() {
  var swiperRes = new Swiper(".swiper-restaurant", {
    effect: "fade",
    slidesPerView: "auto",
    centeredSlides: true,
  });
}
const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  sectionSlider();
  animationMaskCentral();
  animationText();
  imgWithText();
  swiperRestaurant();
};

preloadImages("img").then(() => {
  // Once images are preloaded, remove the 'loading' indicator/class from the body

  init();
});

$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
