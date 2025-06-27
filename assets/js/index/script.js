import { preloadImages } from "../../libs/utils.js";

("use strict");
$ = jQuery;

const lenis = new Lenis({
  duration: 0.5,
  easing: (t) => 1 - Math.pow(1 - t, 4),
  smooth: true,
  smoothTouch: false,
});

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

let isSafari =
  navigator.userAgent.indexOf("Safari") > -1 &&
  navigator.userAgent.indexOf("Chrome") === -1;

// Add class "is-safari" to </body>
if (!isSafari) {
  Splitting();
}

function togglePlayMusic() {
  const thisTarget = $("header .btn-music");
  const audio = $("#player")[0];

  // Kiểm tra xem phần tử audio có tồn tại không
  if (!audio) {
    console.error("Không tìm thấy phần tử audio");
    return;
  }

  thisTarget.on("click", function (e) {
    e.preventDefault();

    // Chuyển đổi class để cập nhật giao diện nút
    thisTarget.toggleClass("pause");

    try {
      if (audio.paused) {
        // Đảm bảo âm thanh không bị mute
        audio.muted = false;
        audio.play().catch((error) => {
          console.error("Lỗi phát nhạc:", error);
        });
      } else {
        audio.pause();
        // Tùy chọn: Đặt lại thời gian về 0 nếu muốn phát lại từ đầu lần sau
        // audio.currentTime = 0;
      }
    } catch (error) {
      console.error("Lỗi điều khiển âm thanh:", error);
    }
  });
}

function sectionSlider() {
  if ($(".section-slider").length < 1) return;
  const sections = document.querySelectorAll(".tab-content .tab-pane");

  // Function để animate content của slide đầu tiên
  function animateInitialSlide(section) {
    gsap.set(
      section.querySelectorAll(
        ".slider-swiper-content h4, .slider-swiper-content .desc, .slider-swiper-content .btn-wrapper"
      ),
      { y: 20, opacity: 0 }
    );
    const initialTl = gsap.timeline();
    initialTl
      .fromTo(
        section.querySelector(
          `.slider-swiper-content .swiper-slide:nth-child(1) h4`
        ),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75 }
      )
      .fromTo(
        section.querySelector(
          `.slider-swiper-content .swiper-slide:nth-child(1) .desc`
        ),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75 },
        "-=0.5"
      )
      .fromTo(
        section.querySelector(
          `.slider-swiper-content .swiper-slide:nth-child(1) .btn-wrapper`
        ),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.5"
      );
  }

  // Function để animate content khi slide change
  function animateSlideContent(section, activeIndex) {
    // Hide tất cả content trước
    gsap.set(
      section.querySelectorAll(
        ".slider-swiper-content h4, .slider-swiper-content .desc, .slider-swiper-content .btn-wrapper"
      ),
      { y: 20, opacity: 0 }
    );

    // Animate content của slide active
    const tl = gsap.timeline();
    tl.fromTo(
      section.querySelector(
        `.slider-swiper-content .swiper-slide:nth-child(${activeIndex + 1}) h4`
      ),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75 }
    )
      .fromTo(
        section.querySelector(
          `.slider-swiper-content .swiper-slide:nth-child(${
            activeIndex + 1
          }) .desc`
        ),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75 },
        "-=0.5"
      )
      .fromTo(
        section.querySelector(
          `.slider-swiper-content .swiper-slide:nth-child(${
            activeIndex + 1
          }) .btn-wrapper`
        ),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.5"
      );
  }

  sections.forEach((section) => {
    const contentSwiperEl = section.querySelector(".slider-swiper-content");
    const mainSwiperEl = section.querySelector(".main-slider");
    const paginationEl = section.querySelector(".swiper-pagination");
    const swiperButton = section.querySelector(".swiper-btn-custom");
    const btnNext = section.querySelector(".swiper-button-next");
    const btnPrev = section.querySelector(".swiper-button-prev");

    // Kiểm tra xem các phần tử có tồn tại không
    if (!contentSwiperEl || !mainSwiperEl || !paginationEl || !swiperButton) {
      console.error("Missing required elements:", {
        contentSwiperEl,
        mainSwiperEl,
        paginationEl,
        swiperButton,
      });
      return;
    }

    const swiperContent = new Swiper(contentSwiperEl, {
      loop: false,
      effect: "fade",
      allowTouchMove: false,
      slidesPerView: 1,
    });

    const swiperMain = new Swiper(mainSwiperEl, {
      effect: "fade",
      loop: false,
      slidesPerView: 1,
      pagination: {
        el: paginationEl,
        clickable: true,
        type: "progressbar",
      },
      navigation: {
        nextEl: btnNext,
        prevEl: btnPrev,
      },
      breakpoints: {
        991: {
          navigation: {
            nextEl: false,
            prevEl: false,
          },
          pagination: {
            el: paginationEl,
            clickable: true,
            type: "fraction",
          },
        },
      },
      thumbs: {
        swiper: swiperContent,
      },
      on: {
        slideChangeTransitionEnd: function () {
          animateSlideContent(section, this.activeIndex);
        },
      },
    });

    if (document.documentElement.clientWidth > 991) {
      let lastMouseX = 0;

      mainSwiperEl.addEventListener("mousemove", (e) => {
        const rect = mainSwiperEl.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const halfWidth = rect.width / 2;
        const buttonWidth = swiperButton.offsetWidth;
        const buttonHeight = swiperButton.offsetHeight;

        lastMouseX = mouseX;

        swiperButton.style.opacity = "1";
        swiperButton.style.transform = "scale(1)";

        let buttonPosX = mouseX - buttonWidth / 2;
        let buttonPosY = mouseY - buttonHeight / 2;

        const transitionZone = 50;
        let rotateDeg;

        if (mouseX <= halfWidth - transitionZone) {
          rotateDeg = 180;
          buttonPosX = Math.max(
            0,
            Math.min(halfWidth - buttonWidth, buttonPosX)
          );
        } else if (mouseX >= halfWidth + transitionZone) {
          rotateDeg = 360;
          buttonPosX = Math.max(
            halfWidth,
            Math.min(rect.width - buttonWidth, buttonPosX)
          );
        } else {
          const progress =
            (mouseX - (halfWidth - transitionZone)) / (transitionZone * 2);
          rotateDeg = 180 + progress * 180;
          buttonPosX = Math.max(
            0,
            Math.min(rect.width - buttonWidth, buttonPosX)
          );
        }

        buttonPosY = Math.max(
          0,
          Math.min(rect.height - buttonHeight, buttonPosY)
        );

        swiperButton.style.left = `${buttonPosX}px`;
        swiperButton.style.top = `${buttonPosY}px`;
        swiperButton.style.transform = `scale(1) rotate(${rotateDeg}deg)`;
      });

      swiperButton.addEventListener("click", (e) => {
        const rect = mainSwiperEl.getBoundingClientRect();
        const halfWidth = rect.width / 2;
        const clickX = e.clientX - rect.left;
        const currentIndex = swiperMain.activeIndex;
        const totalSlides = swiperMain.slides.length;

        if (lastMouseX <= halfWidth) {
          if (currentIndex > 0) {
            swiperMain.slidePrev();
            console.log("slidePrev called");
          } else {
            console.log("Cannot slidePrev: at first slide");
          }
        } else {
          if (currentIndex < totalSlides - 1) {
            swiperMain.slideNext();
            console.log("slideNext called");
          } else {
            console.log("Cannot slideNext: at last slide");
          }
        }
      });

      mainSwiperEl.addEventListener("mouseleave", () => {
        swiperButton.style.opacity = "0";
        swiperButton.style.transform = "scale(0)";
      });
    }

    // Animate slide đầu tiên khi khởi tạo
    animateInitialSlide(section);
  });

  // Thêm event listener cho tab change để animate content
  $(document).on("shown.bs.tab", ".tab-content .nav-link", function (e) {
    const targetTab = $(
      e.target.getAttribute("href") || e.target.dataset.target
    );
    const section = targetTab[0];

    if (section && section.querySelector(".slider-swiper-content")) {
      // Delay nhỏ để đảm bảo tab đã hiển thị hoàn toàn
      setTimeout(() => {
        // Tìm swiper instance trong section này
        const mainSwiperEl = section.querySelector(".main-slider");
        if (mainSwiperEl && mainSwiperEl.swiper) {
          const activeIndex = mainSwiperEl.swiper.activeIndex;
          animateSlideContent(section, activeIndex);
        } else {
          // Nếu chưa có swiper, animate slide đầu tiên
          animateInitialSlide(section);
        }
      }, 100);
    }
  });

  // Thêm support cho các framework tab khác (nếu không dùng Bootstrap)
  $(document).on(
    "click",
    ".nav-tabs .nav-link, .nav-pills .nav-link",
    function (e) {
      const target = this.getAttribute("href") || this.dataset.target;
      if (target) {
        const targetTab = $(target);
        const section = targetTab[0];

        if (section && section.querySelector(".slider-swiper-content")) {
          // Delay để đảm bảo tab transition hoàn thành
          setTimeout(() => {
            const mainSwiperEl = section.querySelector(".main-slider");
            if (mainSwiperEl && mainSwiperEl.swiper) {
              const activeIndex = mainSwiperEl.swiper.activeIndex;
              animateSlideContent(section, activeIndex);
            } else {
              animateInitialSlide(section);
            }
          }, 150);
        }
      }
    }
  );
}

function imgWithText() {
  if ($(".image-with-text").length < 1) return;

  gsap.registerPlugin(ScrollTrigger);

  // $(".image-with-text").each(function () {
  //   const section = this;

  //   gsap.to($(section).find(".content-box "), {
  //     yPercent: -10,
  //     ease: "none",
  //     scrollTrigger: {
  //       trigger: $(section).find(".content-box"),
  //       start: "top 30%",
  //       end: "bottom top",
  //       scrub: true
  //     }
  //   });
  // });

  document.querySelectorAll(".image-with-text").forEach((section) => {
    if (section.classList.contains("parallax")) return;

    const wrapper = section.querySelector(".section-wrapper");
    const image = section.querySelector(".section-wrapper img");
    const detailSlider = section.querySelector(".detail-slider");

    if (!wrapper || !image || detailSlider) return;

    // Animate clip-path
    // gsap.fromTo(
    //   wrapper,
    //   {
    //     clipPath: "inset(0% 0% 0% 0%)"
    //   },
    //   {
    //     scrollTrigger: {
    //       trigger: section,
    //       start: "top 70%",
    //       end: "bottom 70%"
    //       // scrub: 1
    //     },
    //     clipPath: () => {
    //       const viewportWidth = window.innerWidth;
    //       let targetWidth = viewportWidth - 32;
    //       if (viewportWidth > 991) {
    //         targetWidth = viewportWidth - 80;
    //       } else if (viewportWidth > 767) {
    //         targetWidth = viewportWidth - 80;
    //       } else {
    //         targetWidth = viewportWidth - 32;
    //       }

    //       const widthClipPercentage =
    //         ((viewportWidth - targetWidth) / 2 / viewportWidth) * 100;

    //       const currentHeight = section.offsetHeight;
    //       const targetHeight =
    //         viewportWidth > 991 ? currentHeight - 100 : currentHeight;
    //       const heightClipPixels = (currentHeight - targetHeight) / 2;
    //       const heightClipPercentage = (heightClipPixels / currentHeight) * 100;

    //       return `inset(${heightClipPercentage}% ${widthClipPercentage}% ${heightClipPercentage}% ${widthClipPercentage}%)`;
    //     },
    //     duration: 1,
    //     ease: "power2.out"
    //   }
    // );

    // Animate scale image
    // gsap.fromTo(
    //   image,
    //   {
    //     scale: 1
    //   },
    //   {
    //     scrollTrigger: {
    //       trigger: wrapper,
    //       start: "top 70%",
    //       end: "bottom 70%"
    //       // scrub: 1
    //     },
    //     scale: 1.1,
    //     duration: 1,
    //     ease: "power2.out"
    //   }
    // );

    gsap.set(image, { scale: 1.5 });

    gsap.to(image, {
      scale: 1,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "top 20%",
        scrub: true,
      },
    });
  });

  document.querySelectorAll(".image-with-text.parallax").forEach((section) => {
    const img = section.querySelector("img");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        scrub: true,
        pin: false,
        // markers: true
      },
    });

    tl.fromTo(
      img,
      {
        yPercent: -15,
        ease: "none",
      },
      {
        yPercent: 15,
        ease: "none",
      }
    );
  });
}

function animationMaskCentral() {
  // if ($(".image-with-text").length < 1) return;

  const animationImages = document.querySelectorAll(".animation-image");

  animationImages.forEach((image) => {
    gsap.to(image, {
      scrollTrigger: {
        trigger: image,
        start: "top 70%",
        end: "bottom 70%",
        // toggleClass: "show",
        onEnter: () => image.classList.add("show"),
        // markers: true,
      },
    });
  });

  const animationImagesBanner = document.querySelectorAll(
    ".animation-image-banner"
  );

  window.addEventListener("load", () => {
    setTimeout(() => {
      animationImagesBanner.forEach((image) => {
        image.classList.add("show");
      });
    }, 300); // delay 0.3s sau khi load
  });
}

function animationText() {
  gsap.registerPlugin(ScrollTrigger);
  const fxTitle = document.querySelectorAll(
    "[data-splitting][data-effect-one]"
  );

  const fxTitleThree = document.querySelectorAll(
    "[data-splitting][data-effect-three]"
  );

  fxTitle.forEach((element) => {
    const chars = element.querySelectorAll(".char");

    // Lấy màu ban đầu từ CSS (màu mặc định của .char)
    const originalColor = window.getComputedStyle(chars[0]).color || "black"; // Lấy từ phần tử đầu tiên
    const hoverColor =
      getComputedStyle(element).getPropertyValue("--hover-color") || "red"; // Lấy từ biến CSS hoặc mặc định là "red"

    // Tạo timeline cho animation
    const tl = gsap.timeline({ paused: true }).to(chars, {
      color: hoverColor, // Dùng màu từ CSS
      stagger: 0.05, // Delay giữa các ký tự
      duration: 0.2, // Thời gian đổi màu mỗi ký tự
    });

    // Hover events
    element.addEventListener("mouseenter", () => {
      tl.restart(); // Chạy animation khi hover
    });

    element.addEventListener("mouseleave", () => {
      gsap.to(chars, {
        color: originalColor, // Trở về màu ban đầu từ CSS
        stagger: 0.05,
        duration: 0.2,
      });
    });
  });
  if (!isSafari) {
    const fxTitleTwo = document.querySelectorAll(
      "[data-splitting][data-effect-two]"
    );
    fxTitleTwo.forEach((element) => {
      const chars = element.querySelectorAll(".char");
      gsap.fromTo(
        chars,
        {
          "will-change": "opacity, transform",
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          scrollTrigger: {
            trigger: element,
            start: "top 60%",
            end: "bottom 60%",
            // markers: true,
          },
        }
      );
    });
  } else {
    gsap.utils.toArray("[data-effect-two]").forEach((element) => {
      gsap.fromTo(
        element,
        {
          "will-change": "opacity, transform",
          opacity: 0,
          y: 20,
        },
        {
          scrollTrigger: {
            trigger: element,
            start: "top 75%",
            end: "bottom 75%",
          },
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "sine.out",
        }
      );
    });
  }
  fxTitleThree.forEach((element) => {
    const chars = element.querySelectorAll(".char");
    gsap.fromTo(
      chars,
      {
        "will-change": "opacity, transform",
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        scrollTrigger: {
          trigger: element,
          start: "top 40%",
          end: "bottom 40%",
          // markers: true,
        },
      }
    );
  });

  // fade in
  gsap.utils.toArray("[data-fade-in]").forEach((element) => {
    gsap.fromTo(
      element,
      {
        "will-change": "opacity, transform",
        opacity: 0,
        y: 20,
      },
      {
        scrollTrigger: {
          trigger: element,
          start: "top 75%",
          end: "bottom 75%",
        },
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "sine.out",
      }
    );
  });
  gsap.utils.toArray("[data-fade-in-v2]").forEach((element) => {
    gsap.fromTo(
      element,
      {
        "will-change": "opacity, transform",
        opacity: 0,
        y: 20,
      },
      {
        scrollTrigger: {
          trigger: element,
          start: "top 70%",
          end: "bottom 70%",
        },
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "sine.out",
      }
    );
  });
  gsap.utils.toArray("[data-fade-in-v3]").forEach((element) => {
    gsap.fromTo(
      element,
      {
        "will-change": "opacity, transform",
        opacity: 0,
        y: 20,
      },
      {
        scrollTrigger: {
          trigger: element,
          start: "top 90%",
          end: "bottom 90%",
        },
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "sine.out",
      }
    );
  });
  gsap.utils.toArray("[data-fade-in-v4]").forEach((element) => {
    gsap.fromTo(
      element,
      {
        "will-change": "opacity, transform",
        opacity: 0,
        y: 20,
      },
      {
        scrollTrigger: {
          trigger: element,
          start: "top 60%",
          end: "bottom 60%",
        },
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "sine.out",
      }
    );
  });
  // description
  const fxTitleDesc = document.querySelectorAll("[data-fade-desc]");
  fxTitleDesc.forEach((element, elementIdx) => {
    const startValue = element.dataset.start || "50%";

    let myDesc = new SplitType(element, {
      types: "lines, words",
      lineClass: "split-line",
      wordClass: "split-word",
    });
    myDesc.lines.forEach((line, index) => {
      gsap.from(line.querySelectorAll(".split-word"), {
        y: "100%",
        duration: 0.5,
        ease: "power2.out",
        delay: index * 0.1,
        scrollTrigger: {
          trigger: element,
          start: `top ${startValue}`,
          end: `top ${startValue}`,
          toggleActions: "play none none none",
          // markers: true,
        },
      });
    });
  });
  const fxTitleDescv2 = document.querySelectorAll("[data-fade-desc-v2]");
  fxTitleDescv2.forEach((element, elementIdx) => {
    let myDesc = new SplitType(element, {
      types: "lines, words",
      lineClass: "split-line",
      wordClass: "split-word",
    });
    myDesc.lines.forEach((line, index) => {
      gsap.from(line.querySelectorAll(".split-word"), {
        y: "100%",
        duration: 0.5,
        ease: "power2.out",
        delay: index * 0.1,
        scrollTrigger: {
          trigger: element,
          start: "top 70%",
          end: "top 70%",
          toggleActions: "play none none none",
          // markers: true,
        },
      });
    });
  });
}
function swiperRestaurant() {
  if (!document.querySelector(".swiper-restaurant")) return;
  var swiperRes = new Swiper(".swiper-restaurant", {
    effect: "fade",
    slidesPerView: "auto",
    centeredSlides: true,
  });
  const contentRes = document.querySelectorAll(
    ".section-restaurant__content--title a"
  );
  let activeElms = contentRes[0];

  if (activeElms) {
    activeElms.classList.add("active");
  }
  contentRes.forEach((el, index) => {
    el.addEventListener("mouseover", function () {
      swiperRes.slideTo(index);

      if (activeElms) {
        activeElms.classList.remove("active");
      }
      el.classList.add("active");
      activeElms = el;
    });
  });

  if (document.documentElement.clientWidth < 991) {
    if (!document.querySelector(".swiper-res-mobile")) return;
    var swiperRes = new Swiper(".swiper-res-mobile", {
      slidesPerView: 1.25,
      spaceBetween: 24,
      slidesOffsetAfter: 24,
      slidesOffsetBefore: 24,
    });
  }
}
function swiperAct() {
  if (!document.querySelector(".act-slider")) return;

  const container = document.querySelector(".act-slider");
  const swiperButton = container.querySelector(".swiper-btn-act");
  const swiperActContent = document.querySelector(".swiper-act-content");

  // Kiểm tra xem các phần tử có tồn tại không
  if (!container || !swiperButton || !swiperActContent) {
    console.error("Missing required elements:", {
      container,
      swiperButton,
      swiperActContent,
    });
    return;
  }

  const swiperActC = new Swiper(".swiper-act-content", {
    slidesPerView: 1,
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },

    spaceBetween: 30,
    allowTouchMove: false,
  });

  const isMobile = window.innerWidth < 991;
  let interleaveOffset = 0.9;
  const swiperAct = new Swiper(".act-slider", {
    slidesPerView: 1,
    watchSlidesProgress: true,
    breakpoints: {
      991: {
        slidesPerView: 1,
        pagination: {
          el: ".section-act__slider .swiper-pagination",
          clickable: true,
          type: "fraction",
        },
      },
    },
    speed: 1000,
    loop: false,
    pagination: {
      el: ".section-act__slider .swiper-pagination",
      clickable: true,
      type: "progressbar",
    },
    navigation: isMobile
      ? {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }
      : false,
    thumbs: {
      swiper: swiperActC,
    },
    on: {
      progress(swiper) {
        swiper.slides.forEach((slide) => {
          const slideProgress = slide.progress || 0;
          const innerOffset = swiper.width * interleaveOffset;
          const innerTranslate = slideProgress * innerOffset;

          if (!isNaN(innerTranslate)) {
            const slideInner = slide.querySelector(".swiper-box-img");
            if (slideInner) {
              slideInner.style.transform = `translate3d(${innerTranslate}px, 0, 0)`;
            }
          }
        });
      },
      touchStart(swiper) {
        swiper.slides.forEach((slide) => {
          slide.style.transition = "";
        });
      },
      setTransition(swiper, speed) {
        const easing = "cubic-bezier(0.25, 0.1, 0.25, 1)";
        swiper.slides.forEach((slide) => {
          slide.style.transition = `${speed}ms ${easing}`;
          const slideInner = slide.querySelector(".swiper-box-img");
          if (slideInner) {
            slideInner.style.transition = `${speed}ms ${easing}`;
          }
        });
      },
    },
  });
  $(".swiper-button-prev-mobile").on("click", function () {
    swiperAct.slidePrev();
  });
  $(".swiper-button-next-mobile").on("click", function () {
    swiperAct.slideNext();
  });
  function handleSwiperDirection() {
    // if (window.innerWidth >= 991) {
    //   swiperAct.changeLanguageDirection("rtl");
    // } else {
    //   swiperAct.changeLanguageDirection("ltr"); // Optional: Reset to LTR for smaller screens
    // }
  }

  // Run on page load
  handleSwiperDirection();

  // Update on window resize
  window.addEventListener("resize", handleSwiperDirection);

  // Hover effect và click cho desktop
  if (!isMobile) {
    let lastMouseX = 0;

    container.addEventListener("mousemove", (e) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const halfWidth = rect.width / 2;
      const buttonWidth = swiperButton.offsetWidth;
      const buttonHeight = swiperButton.offsetHeight;

      // Cập nhật lastMouseX
      lastMouseX = mouseX;

      // Hiển thị nút
      swiperButton.style.opacity = "1";
      swiperButton.style.transform = "scale(1)";

      // Tính toán vị trí
      let buttonPosX = mouseX - buttonWidth / 2;
      let buttonPosY = mouseY - buttonHeight / 2;

      // Xác định góc xoay dựa trên vị trí chuột
      const transitionZone = 50;
      const zone = 0;
      let rotateDeg;

      if (mouseX <= halfWidth - transitionZone) {
        // Nửa trái: prev, mũi tên hướng trái (180deg)
        rotateDeg = 180;
        buttonPosX = Math.max(
          -zone,
          Math.min(halfWidth - buttonWidth, buttonPosX)
        );
      } else if (mouseX >= halfWidth + transitionZone) {
        // Nửa phải: next, mũi tên hướng phải (0deg)
        rotateDeg = 0;
        buttonPosX = Math.max(
          halfWidth,
          Math.min(rect.width - buttonWidth + zone, buttonPosX)
        );
      } else {
        // Vùng chuyển tiếp: xoay từ 180deg qua 90deg đến 0deg (lên trên)
        const progress =
          (mouseX - (halfWidth - transitionZone)) / (transitionZone * 2);
        rotateDeg = 180 - progress * 90; // Từ 180deg -> 90deg -> 0deg
        buttonPosX = Math.max(
          -zone,
          Math.min(rect.width - buttonWidth + zone, buttonPosX)
        );
      }

      // Giới hạn vị trí Y
      buttonPosY = Math.max(
        -zone,
        Math.min(rect.height - buttonHeight + zone, buttonPosY)
      );

      // Áp dụng vị trí và xoay
      swiperButton.style.left = `${buttonPosX}px`;
      swiperButton.style.top = `${buttonPosY}px`;
      swiperButton.style.transform = `scale(1) rotate(${rotateDeg}deg)`;
    });

    container.addEventListener("mouseleave", () => {
      swiperButton.style.opacity = "0";
      swiperButton.style.transform = "scale(0)";
    });

    // Click handler
    swiperButton.addEventListener("click", () => {
      const rect = container.getBoundingClientRect();
      const halfWidth = rect.width / 2;
      const currentIndex = swiperAct.activeIndex;
      const totalSlides = swiperAct.slides.length;

      if (lastMouseX <= halfWidth) {
        // Nửa trái: gọi slidePrev nếu không ở slide đầu
        if (currentIndex > 0) {
          swiperAct.slidePrev();
          console.log("slidePrev called");
        } else {
          console.log("Cannot slidePrev: at first slide");
        }
      } else {
        // Nửa phải: gọi slideNext nếu không ở slide cuối
        if (currentIndex < totalSlides - 1) {
          swiperAct.slideNext();
          console.log("slideNext called");
        } else {
          console.log("Cannot slideNext: at last slide");
        }
      }
    });
  }
}

function swiperOffer() {
  if (!document.querySelector(".swiper-offer")) return;
  var swiperOffer = new Swiper(".swiper-offer", {
    spaceBetween: 24,
    slidesPerView: 1.25,
    speed: 1000,
    navigation: {
      nextEl: ".section-offer__slider .swiper-button-next",
      prevEl: ".section-offer__slider .swiper-button-prev",
    },
    pagination: {
      el: ".section-offer__slider .swiper-pagination",
      type: "progressbar",
    },
    slidesOffsetAfter: 24,
    slidesOffsetBefore: 24,
    breakpoints: {
      991: {
        slidesPerView: 3,
        spaceBetween: 40,
        slidesOffsetAfter: 0,
        slidesOffsetBefore: 0,
      },
    },
  });
}
function animationLineMap() {
  if ($("#maskRect").length < 1) return;

  gsap.registerPlugin(ScrollTrigger);

  const svgContainer = document.querySelector(".svg-container");
  const hasNotBanner = svgContainer.classList.contains("not-banner");

  gsap.to("#maskRect", {
    height: 5989, // bằng chiều cao SVG
    ease: "none",
    scrollTrigger: {
      trigger: svgContainer,
      start: hasNotBanner ? "top top" : "top center",
      end: "bottom bottom",
      scrub: true,
      // markers: true,
    },
  });
  // gsap.to("#rect", {
  //   ease: "none",
  //   motionPath: {
  //     path: "#path",
  //     align: "#path",
  //     autoRotate: true,
  //     alignOrigin: [0.5, 0.5],
  //     start: 1,
  //     end: 0, // đảo hướng
  //   },
  //   scrollTrigger: {
  //     trigger: ".svg-container",
  //     start: "top 55%",
  //     end: "bottom bottom",
  //     scrub: true,
  //     markers: true,
  //   },
  // });
}
function scrollHeader() {
  ScrollTrigger.refresh();

  ScrollTrigger.create({
    start: "top top",
    end: 99999,
    paused: true,
    onUpdate: (self) => {
      const header = document.querySelector("header");
      const navSticky = document.querySelector(".nav-tabs");
      const scrollY = window.scrollY;

      // Kiểm tra scrollY để xóa lớp 'scrolled' khi ở đầu trang
      if (scrollY === 0) {
        header.classList.remove("scrolled");
      }

      // Kiểm tra hướng cuộn (self.direction)
      if (self.direction === 1) {
        // Cuộn xuống
        const hamburger = document.querySelector(".btn-hamburger");
        if (!hamburger.classList.contains("change")) {
          header.classList.add("scrolled");
        }

        if (navSticky) {
          // Chỉ thêm lớp 'scrolled' nếu navSticky tồn tại
          navSticky.classList.add("scrolled");
        }
      } else {
        // Cuộn lên
        header.classList.remove("scrolled");
        if (navSticky) {
          // Chỉ xóa lớp 'scrolled' nếu navSticky tồn tại
          navSticky.classList.remove("scrolled");
        }
      }

      // Xử lý lớp 'hide' cho .cta-group
      self.direction === 1
        ? $(".cta-group").addClass("hide")
        : $(".cta-group").removeClass("hide");
    },
  });
}

function animationArt() {
  const animationArt = document.querySelectorAll(".animation-art");

  animationArt.forEach((image) => {
    // Parallax effect
    gsap.to(image, {
      yPercent: 20, // Move element upward by 20% of its height
      ease: "none",
      scrollTrigger: {
        trigger: image,
        start: "top bottom", // Start when the top of the image hits the bottom of the viewport
        end: "bottom top", // End when the bottom of the image hits the top of the viewport
        scrub: true, // Smoothly tie the animation to scroll
        // markers: true,
      },
    });
  });

  const animationArtReverse = document.querySelectorAll(
    ".animation-art-reverse"
  );

  animationArtReverse.forEach((imageR) => {
    // Parallax effect
    gsap.to(imageR, {
      yPercent: 50, // Move element downward by 20% of its height
      ease: "none",
      scrollTrigger: {
        trigger: imageR,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        // markers: true,
      },
    });
  });
}
function headerMenu() {
  let $btnMenu = $(".btn-hamburger");
  let $containerMenu = $(".header-sub-menu");
  let $subMenuOverlay = $(".sub-menu-overlay");
  let tl = gsap.timeline({ paused: true });
  let tl2 = gsap.timeline({ paused: true });

  tl.from(".header-sub-menu .sub-menu-container .sub-menu > ul > li", {
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 0.3,
    ease: "power2.out",
  });

  // console.log($(".header-sub-menu .sub-menu-container .sub-menu > ul > li"));

  tl2.from(
    ".sub-menu-container .sub-menu > ul > li.menu-item-has-children li",
    {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.3,
      ease: "power2.out",
    }
  );

  $btnMenu.on("click", function () {
    $containerMenu.toggleClass("show");
    $btnMenu.toggleClass("change");

    if ($containerMenu.hasClass("show")) {
      tl.restart();
      $("body").addClass("overflow-hidden");
    } else {
      tl.reverse();
      $("body").removeClass("overflow-hidden");
    }
  });

  $subMenuOverlay.on("click", function () {
    tl.reverse();
    $btnMenu.removeClass("change");
    $containerMenu.removeClass("show");
    $("body").removeClass("overflow-hidden");
  });

  if ($(window).width() > 992) return;

  let menuHasChilden = $("header .sub-menu .menu-item-has-children a");
  menuHasChilden.on("click", function (e) {
    e.preventDefault();
    tl.reverse();
    tl2.restart();

    let thisItem = $(this);
    let thisSubMenu = thisItem.closest(".menu-item-has-children");
    thisSubMenu.addClass("open");
  });

  let btnBack = $("header .menu-item-has-children .return");
  btnBack.on("click", function (e) {
    e.preventDefault();
    tl.restart();
    tl2.reverse();

    $(".menu-item-has-children.open").removeClass("open");
  });
}

function toggleDropdown() {
  const $dropdowns = jQuery(".dropdown-custom");

  $dropdowns.each(function () {
    const $dropdown = jQuery(this);
    const $btnDropdown = $dropdown.find(".dropdown-custom__btn");
    const $dropdownMenu = $dropdown.find(".dropdown-custom__menu");
    const $dropdownItems = $dropdown.find(".dropdown-custom__item");
    const $textDropdown = $dropdown.find(".dropdown-custom__text");

    $btnDropdown.on("click", function (e) {
      e.stopPropagation();
      closeAllDropdowns($dropdown);
      $dropdownMenu.toggleClass("dropdown--active");
      // jQuery(".language__head").toggleClass("--active");
      // jQuery(".destination-head").toggleClass("--active");

      const clickYPosition = e.clientY;
      const viewportHeight = jQuery(window).height();

      if (clickYPosition > viewportHeight / 2) {
        $dropdownMenu.removeClass("dropdown-up");
      } else {
        $dropdownMenu.addClass("dropdown-up");
      }
    });

    jQuery(document).on("click", function () {
      closeAllDropdowns();
      // jQuery(".language__head").removeClass("--active");
      // jQuery(".destination-head").removeClass("--active");
    });

    $dropdownItems.on("click", function (e) {
      e.stopPropagation();
      const $item = jQuery(this);
      const tmp = $textDropdown.text();
      $textDropdown.text($item.text());
      if ($item.hasClass("language__item")) {
        $item.text(tmp);
      }
      closeAllDropdowns();
    });

    function closeAllDropdowns(exception) {
      $dropdowns.each(function () {
        const $menu = jQuery(this).find(".dropdown-custom__menu");
        if (!exception || !jQuery(this).is(exception)) {
          $menu.removeClass("dropdown--active");
          // jQuery(".language__head").removeClass("--active");
          // jQuery(".destination-head").removeClass("--active");
        }
      });
    }
  });
}

function modalBooking() {
  if ($(".modal-booking").length < 1) return;

  const dateField = document.querySelector('[name="booking-startday"]');
  if (!dateField) {
    console.error('Input field [name="booking-startday"] not found');
    return;
  }

  // Initialize Lightpick for date picker
  const pickerBooking = new Lightpick({
    field: dateField,
    singleDate: true, // Changed to true for single date
    numberOfMonths: 1,
    format: "DD/MM/YYYY",
    minDate: moment(),
    onSelect: function (start) {
      try {
        if (!start) {
          console.warn("start is undefined in onSelect");
          return;
        }
        $('[name="booking-startday"]').val(start.format("DD/MM/YYYY"));
        $(".field.date .field-border-bottom").removeClass("error");
      } catch (error) {
        console.error("Error in Lightpick onSelect:", error);
      }
    },
  });

  // Form submission handler
  $("form").on("submit", function (e) {
    e.preventDefault();

    // Validate required fields
    let isValid = true;
    const form = $(this);
    $(".error").removeClass("error");

    const requiredFields = [
      {
        name: "booking-startday",
        errorField: ".field.date .field-border-bottom",
      },
      { name: "booking-adult", errorField: ".adult.field-border-bottom" },
      { name: "booking-name", errorField: ".name.field-border-bottom" },
      { name: "booking-phone", errorField: ".phone.field-border-bottom" },
    ];

    requiredFields.forEach((field) => {
      const input = $(`[name="${field.name}"]`);

      if (!input.val() || input.val().trim() === "") {
        $(field.errorField).addClass("error");
        isValid = false;
      }
    });

    // Validate phone number format
    const phone = $('[name="booking-phone"]').val();
    if (phone && !/^[0-9]{10,11}$/.test(phone)) {
      $(".phone.field-border-bottom").addClass("error");
      isValid = false;
    }

    // If validation passes, show success modal
    if (isValid) {
      // this.reset();

      const formData = {
        action: "submit_booking_form",
        booking_startday: form.find('[name="booking-startday"]').val(),
        booking_adult: form.find('[name="booking-adult"]').val(),
        booking_child: form.find('[name="booking-child"]').val(),
        booking_name: form.find('[name="booking-name"]').val(),
        booking_phone: form.find('[name="booking-phone"]').val(),
        booking_email: form.find('[name="booking-email"]').val(),
        booking_message: form.find('[name="booking-message"]').val(),
        data_id: form.find('[name="data-id"]').val(),
        data_posttype: form.find('[name="data-posttype"]').val(),
      };

      $.ajax({
        url: ajaxUrl,
        type: "POST",
        data: formData,
        beforeSend: function () {
          form.find("button[type='submit']").addClass("aloading");
        },
        success: function (response) {
          if (response.success) {
            form.find("button[type='submit']").removeClass("aloading");

            console.log("Đặt chỗ thành công:", response.data);
            $("form")[0].reset();
            $("#modalBooking").modal("hide");
            $("#modalBookingSuccess").modal("show");
          } else {
            console.error("Lỗi xử lý từ server:", response.data);
          }
        },
        error: function (xhr, status, error) {
          console.error("Lỗi AJAX:", status, error);
        },
      });

      $(".error").removeClass("error");
    }
  });

  // Remove error class when user starts typing in required fields
  $('[name="booking-adult"], [name="booking-name"], [name="booking-phone"]').on(
    "input",
    function () {
      const parent = $(this).closest(".field-border-bottom");
      if (parent.hasClass("error")) {
        parent.removeClass("error");
      }
    }
  );

  // Show date picker when clicking date input
  $('[name="booking-startday"]').on("click", function () {
    pickerBooking.show();
  });
}

function magicCursor() {
  if ($(".magic-cursor").length < 1) return;

  var circle = document.querySelector(".magic-cursor");

  gsap.set(circle, {
    xPercent: -50,
    yPercent: -50,
  });

  let mouseX = 0,
    mouseY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Di chuyển circle trực tiếp đến vị trí con chuột
    gsap.to(circle, {
      x: mouseX,
      y: mouseY,
      duration: 0.1, // Không có độ trễ
    });
  });

  const items = document.querySelectorAll("[data-cursor-text]");
  var cursorDot = document.querySelector(".magic-cursor .cursor");
  var cursorText = document.querySelector(".magic-cursor .cursor .text");

  items.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      let text = "";
      text = item.getAttribute("data-cursor-text");

      // const text = item.getAttribute("data-cursor-text");
      cursorText.innerHTML = `<span class="b2-regular color-white">${text}</span>`;
      cursorDot.classList.add("show-text");
    });

    item.addEventListener("mouseleave", () => {
      cursorText.innerHTML = "";
      cursorDot.classList.remove("show-text");
    });
  });
}

function detailSlider() {
  // Kiểm tra container có tồn tại
  const container = document.querySelector(".image-with-text .detail-slider");
  if (!container) {
    console.warn("Detail slider (.image-with-text .detail-slider) not found");
    return;
  }

  const parentContainer = document.querySelector(".image-with-text");
  if (!parentContainer) {
    console.warn("Parent container (.image-with-text) not found");
    return;
  }

  const interleaveOffset = 0.9;
  const swiperButton = document.querySelector(
    ".image-with-text .detail-slider__arrows"
  );

  // Kiểm tra swiperButton tồn tại
  if (!swiperButton) {
    console.warn(
      "Swiper button (.image-with-text .detail-slider__arrows) not found"
    );
    return;
  }

  // Khởi tạo Swiper
  const detailSlider = new Swiper(container, {
    loop: false,
    speed: 1500,
    watchSlidesProgress: true,
    mousewheel: false,
    keyboard: false,
    allowTouchMove: true,
    autoplay: false,
    pagination: {
      el: ".image-with-text .swiper-pagination",
      type: "progressbar",
    },
    breakpoints: {
      991: {
        allowTouchMove: false,
      },
    },
    // Loại bỏ navigation vì không dùng nút mặc định
    on: {
      progress(swiper) {
        swiper.slides.forEach((slide) => {
          const slideProgress = slide.progress || 0;
          const innerOffset = swiper.width * interleaveOffset;
          const innerTranslate = slideProgress * innerOffset;

          if (!isNaN(innerTranslate)) {
            const slideInner = slide.querySelector(".detail-slider__image");
            if (slideInner) {
              slideInner.style.transform = `translate3d(${innerTranslate}px, 0, 0)`;
            }
          }
        });
      },
      touchStart(swiper) {
        swiper.slides.forEach((slide) => {
          slide.style.transition = "";
        });
      },
      setTransition(swiper, speed) {
        const easing = "cubic-bezier(0.25, 0.1, 0.25, 1)";
        swiper.slides.forEach((slide) => {
          slide.style.transition = `${speed}ms ${easing}`;
          const slideInner = slide.querySelector(".detail-slider__image");
          if (slideInner) {
            slideInner.style.transition = `${speed}ms ${easing}`;
          }
        });
      },
    },
  });

  let lastMouseX = null;

  // Xử lý sự kiện mousemove trên .image-with-text
  parentContainer.addEventListener("mousemove", (e) => {
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const halfWidth = rect.width / 2;
    const buttonWidth = swiperButton.offsetWidth;
    const buttonHeight = swiperButton.offsetHeight;
    const offset = 40; // Khoảng cách 40px từ cả bốn cạnh

    lastMouseX = mouseX;

    // Hiển thị nút
    swiperButton.style.opacity = "1";
    swiperButton.style.transition = "opacity 0.3s, transform 0.3s";

    // Tính toán vị trí
    let buttonPosX = mouseX - buttonWidth / 2;
    let buttonPosY = mouseY - buttonHeight / 2;
    const transitionZone = 20;
    let rotateDeg;

    if (mouseX <= halfWidth - transitionZone) {
      rotateDeg = 180; // Nửa trái: prev
      buttonPosX = Math.max(
        offset,
        Math.min(halfWidth - buttonWidth, buttonPosX)
      );
    } else if (mouseX >= halfWidth + transitionZone) {
      rotateDeg = 0; // Nửa phải: next
      buttonPosX = Math.max(
        halfWidth,
        Math.min(rect.width - buttonWidth - offset, buttonPosX)
      );
    } else {
      const progress =
        (mouseX - (halfWidth - transitionZone)) / (transitionZone * 2);
      rotateDeg = 180 - progress * 180; // Vùng chuyển tiếp
      buttonPosX = Math.max(
        offset,
        Math.min(rect.width - buttonWidth - offset, buttonPosX)
      );
    }

    // Giới hạn vị trí Y với offset 40px
    buttonPosY = Math.max(
      offset,
      Math.min(rect.height - buttonHeight - offset, buttonPosY)
    );

    // Áp dụng transform
    swiperButton.style.left = `${buttonPosX}px`;
    swiperButton.style.top = `${buttonPosY}px`;
    swiperButton.style.transform = `scale(1) rotate(${rotateDeg}deg)`;
    swiperButton.style.transition = " transform 0.3s";
  });

  // Xử lý sự kiện mouseleave
  parentContainer.addEventListener("mouseleave", () => {
    swiperButton.style.opacity = "0";
    swiperButton.style.transform = "scale(0)";
    swiperButton.style.transition = "opacity 0.3s, transform 0.3s";
    lastMouseX = null;
  });

  // Xử lý sự kiện click
  swiperButton.addEventListener("click", (e) => {
    const rect = container.getBoundingClientRect();
    const halfWidth = rect.width / 2;
    const currentIndex = detailSlider.activeIndex;
    const totalSlides = detailSlider.slides.length;

    // Lấy vị trí chuột tại thời điểm click
    const mouseX = lastMouseX !== null ? lastMouseX : e.clientX - rect.left;

    if (mouseX <= halfWidth) {
      if (currentIndex > 0) {
        detailSlider.slidePrev();
        console.log("slidePrev called");
      } else {
        console.log("Cannot slidePrev: at first slide");
      }
    } else {
      if (currentIndex < totalSlides - 1) {
        detailSlider.slideNext();
        console.log("slideNext called");
      } else {
        console.log("Cannot slideNext: at last slide");
      }
    }
  });
}

function loading() {
  if (!document.querySelector(".loading")) return;
  const loading = document.querySelector(".loading");
  loading.classList.add("loading-out");
  document.body.classList.remove("scroll-hidden");
  setTimeout(() => {
    fadeTextPageDetail();
  }, 1000);
  setTimeout(() => {
    // Ẩn các phần tử .loading sau 1500ms
    document.querySelectorAll(".loading").forEach((element) => {
      element.style.display = "none";
    });
  }, 1500);
}

// loading();
$(window).on("DOMContentLoaded", function () {
  setTimeout(() => {
    loading();
  }, 2000);
});
function updateSvgHeight() {
  const svg = document.querySelector(".svg-container svg");
  const footer = document.querySelector("footer"); // Giả sử footer có thẻ <footer>

  // Kiểm tra xem svg và footer có tồn tại không
  if (!svg) {
    // console.error(
    //   'SVG element not found. Check if ".svg-container svg" exists.'
    // );
    return;
  }
  if (svg.classList.contains("not-update")) {
    return;
  }
  if (!footer) {
    // console.error('Footer element not found. Check if "footer" exists.');
    return;
  }

  const bodyHeight = document.body.clientHeight;
  const viewportHeight = window.innerHeight; // 100vh
  const footerHeight = footer.clientHeight; // Chiều cao của footer
  const adjustedHeight = bodyHeight - viewportHeight - (footerHeight - 140);
  console.log(adjustedHeight);

  // Đảm bảo chiều cao không âm
  if (adjustedHeight > 0) {
    svg.setAttribute("height", adjustedHeight);
  } else {
    svg.setAttribute("height", viewportHeight); // Hoặc giá trị mặc định
  }
}
// window.addEventListener("resize", updateSvgHeight);
function gallery() {
  console.log("animated-thumb");
  if (!document.querySelector(".animated-thumb")) return;

  const galleryInstance = lightGallery(
    document.querySelector(".animated-thumb"),
    {
      selector: ".thumb-img",
      thumbnail: true,
      download: false,
      height: "100%",
      width: "100%",
      iframeMaxWidth: "100%",
      subHtmlSelectorRelative: true,
      showCloseIcon: true,
      mobileSettings: {
        controls: true,
        showCloseIcon: true,
        download: false,
      },
    }
  );

  let autoAdvanceInterval = null;

  // Khi gallery đã mở hoàn tất
  document
    .querySelector(".animated-thumb")
    .addEventListener("lgAfterOpen", function () {
      autoAdvanceInterval = setInterval(() => {
        galleryInstance.goToNextSlide();
      }, 5000);
    });

  // Khi gallery đóng
  document
    .querySelector(".animated-thumb")
    .addEventListener("lgAfterClose", function () {
      clearInterval(autoAdvanceInterval);
    });

  // Custom cursor logic
  const prevCursor = document.querySelector(".lg-prev");
  const nextCursor = document.querySelector(".lg-next");
  const gallery = document.querySelector(".lg-container");
  const closeCursor = document.querySelector(".lg-close");

  let isOverClose = false;

  gallery.addEventListener("mousemove", (e) => {
    if (isOverClose) return;

    const galleryRect = gallery.getBoundingClientRect();
    const centerX = galleryRect.left + galleryRect.width / 2;

    prevCursor.style.left = e.clientX + "px";
    prevCursor.style.top = e.clientY + "px";
    nextCursor.style.left = e.clientX + "px";
    nextCursor.style.top = e.clientY + "px";

    if (e.clientX < centerX) {
      prevCursor.style.display = "block";
      nextCursor.style.display = "none";
    } else {
      prevCursor.style.display = "none";
      nextCursor.style.display = "block";
      nextCursor.style.transform = "scale(1) translate(-200%, -150%)";
    }
  });

  gallery.addEventListener("mouseleave", () => {
    prevCursor.style.display = "none";
    nextCursor.style.display = "none";
  });

  closeCursor.addEventListener("mouseenter", () => {
    isOverClose = true;
    nextCursor.style.transform = "scale(0) translate(-200%, -150%)";
  });

  closeCursor.addEventListener("mouseleave", () => {
    isOverClose = false;
    nextCursor.style.transform = "scale(1) translate(-200%, -150%)";
  });
}

function fadeTextFooter() {
  gsap.set("data-text-footer", {
    opacity: 0,
    y: 20,
  });
  let tlf = gsap.timeline({ paused: true });

  tlf.fromTo(
    "[data-text-footer]",
    {
      opacity: 0,
      y: 20,
    },
    {
      opacity: 1,
      y: 0,
      stagger: 0.05,
      duration: 0.6,
      ease: "power2.out",
    }
  );
  ScrollTrigger.create({
    trigger: "footer",
    start: "top 80%",
    // markers: true,
    animation: tlf,
    toggleActions: "play none none none",
  });
}
function fadeTextPageDetail() {
  // Tạo GSAP Timeline để điều khiển thứ tự
  const tl = gsap.timeline();

  // Xử lý hiệu ứng cho [data-splitting][data-effect-auto] nếu tồn tại
  if (!isSafari) {
    const fxTitleAuto = document.querySelectorAll(
      "[data-splitting][data-effect-auto]"
    );
    if (fxTitleAuto.length > 0) {
      fxTitleAuto.forEach((element) => {
        const chars = element.querySelectorAll(".char");
        tl.fromTo(
          chars,
          {
            "will-change": "opacity, transform",
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            stagger: 0.05,
            duration: 0.3,
            ease: "sine.out",
          }
        );
      });
    }
  } else {
    gsap.utils.toArray("[data-effect-auto]").forEach((element) => {
      gsap.fromTo(
        element,
        {
          "will-change": "opacity, transform",
          opacity: 0,
          y: 20,
        },
        {
          scrollTrigger: {
            trigger: element,
            start: "top 75%",
            end: "bottom 75%",
          },
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "sine.out",
        }
      );
    });
  }

  // Xử lý hiệu ứng cho [data-fade-auto] nếu tồn tại, hỗ trợ data-delay
  const fadeAuto = gsap.utils.toArray("[data-fade-auto]");
  if (fadeAuto.length > 0) {
    fadeAuto.forEach((element) => {
      // Lấy giá trị data-delay, mặc định là 0 nếu không có
      const delay = parseFloat(element.dataset.delay) || 0;
      tl.fromTo(
        element,
        {
          "will-change": "opacity, transform",
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "sine.out",
          delay: delay,
        }
      );
    });
  }

  // Xử lý hiệu ứng cho [data-fade-desc] nếu tồn tại
  const fxTitleDesc = document.querySelectorAll("[data-fade-desc-auto]");

  if (fxTitleDesc.length > 0) {
    fxTitleDesc.forEach((element) => {
      // Khởi tạo SplitType
      let myDesc = new SplitType(element, {
        types: "lines, words",
        lineClass: "split-line",
        wordClass: "split-word",
      });

      // Tạo timeline GSAP
      let tl1 = gsap.timeline({ paused: true });

      // Animate tất cả .split-word cùng lúc
      tl1.fromTo(
        element.querySelectorAll(".split-word"),
        {
          y: "100%",
          opacity: 0,
        },
        {
          y: "0%",
          opacity: 1,
          duration: 0.5,
          ease: "none",
        }
      );
      setTimeout(() => {
        tl1.play();
      }, 1100);
    });
  }

  // Xử lý hiệu ứng cho [data-fade-auto-button] nếu tồn tại
  const fadeAutoButton = gsap.utils.toArray("[data-fade-auto-button]");
  if (fadeAutoButton.length > 0) {
    fadeAutoButton.forEach((element) => {
      tl.fromTo(
        element,
        {
          "will-change": "opacity, transform",
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.2,
          ease: "none",
        }
      );
    });
  }

  // Xử lý hiệu ứng cho [data-fade-auto-bottom] nếu tồn tại
  const fadeAutoBottom = gsap.utils.toArray("[data-fade-auto-bottom]");
  if (fadeAutoBottom.length > 0) {
    fadeAutoBottom.forEach((element) => {
      tl.fromTo(
        element,
        {
          "will-change": "opacity, transform",
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "sine.out",
          stagger: 0.1,
        }
      );
    });
  }
}

function contactForm() {
  if ($(".contact-form").length < 1) return;

  const contactForm = $("#contact-form");
  const nameField = contactForm.find("input[name='name']");
  const emailField = contactForm.find("input[name='email']");
  const phoneField = contactForm.find("input[type='tel']");
  const messageField = contactForm.find("textarea[name='message']");
  const checkbox = $("#contact_checkbox");
  const submitButton = contactForm.find("button[type='submit']");

  function validateFieldsForButton() {
    const isNameFilled = nameField.val().trim() !== "";
    const isEmailFilled = emailField.val().trim() !== "";
    const isPhoneFilled = phoneField.val().trim() !== "";
    const isChecked = checkbox.is(":checked");

    // if (isNameFilled && isEmailFilled && isPhoneFilled && isChecked) {
    //   submitButton.removeAttr("disabled");
    // } else {
    //   submitButton.attr("disabled", true);
    // }
  }

  // Gán sự kiện khi người dùng nhập liệu hoặc check/uncheck
  nameField.on("input", validateFieldsForButton);
  emailField.on("input", validateFieldsForButton);
  phoneField.on("input", validateFieldsForButton);
  checkbox.on("change", validateFieldsForButton);

  // Ban đầu disable nếu điều kiện chưa đủ
  validateFieldsForButton();

  contactForm.on("submit", function (e) {
    e.preventDefault();

    contactForm.find(".error-message").remove();
    contactForm.find("input, textarea").removeClass("error");

    let isValid = true;

    if (!nameField.val().trim()) {
      nameField.addClass("error");
      isValid = false;
    }

    if (!emailField.val().trim()) {
      emailField.addClass("error");
      isValid = false;
    }

    if (!phoneField.val().trim()) {
      phoneField.addClass("error");
      isValid = false;
    }

    // if (!checkbox.is(":checked")) {
    //   checkbox.addClass("error");
    //   isValid = false;
    // }

    if (!isValid) return;

    $.ajax({
      type: "POST",
      url: ajaxUrl,
      data: {
        action: "submit_contact_form",
        name: nameField.val().trim(),
        email: emailField.val().trim(),
        phone: phoneField.val().trim(),
        messageNote: messageField.val().trim(),
        getNewletter: checkbox.is(":checked") ? "true" : "false",
      },
      beforeSend: function () {
        $(".contact-message").remove();
        submitButton.addClass("aloading");
      },
      success: function (res) {
        $(".contact-message").remove();
        submitButton.removeClass("aloading");
        contactForm[0].reset();
        $("#modalBookingSuccess").modal("show");
        // submitButton.attr("disabled", true);
      },
      error: function (xhr, status, error) {
        console.error("Lỗi khi gửi form:", error);
        $(".contact-message").remove();
        contactForm.append(
          '<span class="contact-message" style="color: red;">Có lỗi xảy ra, vui lòng thử lại sau.</span>'
        );
      },
    });
  });
}

function getNewletter() {
  $("#form-newletter").on("submit", function (e) {
    e.preventDefault();

    const thisForm = $(this);
    const emailField = thisForm.find("input[type='email']");

    emailField.removeClass("error");
    thisForm.siblings("span").remove();

    if (!emailField.length) {
      console.error("Không tìm thấy input email trong form.");
      return;
    }

    const email = emailField.val() ? emailField.val().trim() : "";

    if (!email) {
      emailField.addClass("error");
      return;
    }

    $.ajax({
      type: "POST",
      url: ajaxUrl,
      data: {
        action: "costamigo_receive_newletter",
        email: email,
      },
      beforeSend: function () {
        console.log("Đang gửi dữ liệu...");
      },
      success: function (res) {
        thisForm[0].reset();
        $("#modalNewsletterSuccess").modal("show");
      },
      error: function (xhr, status, error) {
        console.error("Lỗi khi gửi form:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại sau.");
      },
    });
  });
}
function swiperBanner() {
  if ($(".banner-slider").length < 1) return;
  let interleaveOffset = 0.9;
  const container = document.querySelector(".banner-slider");
  const bannerSwiper = new Swiper(".banner-slider", {
    loop: false,
    speed: 1500,
    watchSlidesProgress: true,
    mousewheel: false,
    keyboard: false,
    allowTouchMove: true,
    autoplay: true,

    breakpoints: {
      991: {
        allowTouchMove: false,
        autoplay: false,
      },
    },
    // Loại bỏ navigation vì không dùng nút mặc định
    on: {
      progress(swiper) {
        swiper.slides.forEach((slide) => {
          const slideProgress = slide.progress || 0;
          const innerOffset = swiper.width * interleaveOffset;
          const innerTranslate = slideProgress * innerOffset;

          if (!isNaN(innerTranslate)) {
            const slideInner = slide.querySelector(".banner-slider-img");
            if (slideInner) {
              slideInner.style.transform = `translate3d(${innerTranslate}px, 0, 0)`;
            }
          }
        });
      },
      touchStart(swiper) {
        swiper.slides.forEach((slide) => {
          slide.style.transition = "";
        });
      },
      setTransition(swiper, speed) {
        const easing = "cubic-bezier(0.25, 0.1, 0.25, 1)";
        swiper.slides.forEach((slide) => {
          slide.style.transition = `${speed}ms ${easing}`;
          const slideInner = slide.querySelector(".banner-slider-img");
          if (slideInner) {
            slideInner.style.transition = `${speed}ms ${easing}`;
          }
        });
      },
    },
  });
  const swiperButton = document.querySelector(
    ".banner-slider .swiper-btn-custom"
  );
  const parentContainer = document.querySelector(".banner-slider");
  let lastMouseX = null;
  // Xử lý sự kiện mousemove trên .image-with-text
  parentContainer.addEventListener("mousemove", (e) => {
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const halfWidth = rect.width / 2;
    const buttonWidth = swiperButton.offsetWidth;
    const buttonHeight = swiperButton.offsetHeight;
    const offset = 40; // Khoảng cách 40px từ cả bốn cạnh

    lastMouseX = mouseX;

    // Hiển thị nút
    swiperButton.style.opacity = "1";
    swiperButton.style.transition = "opacity 0.3s, transform 0.3s";

    // Tính toán vị trí
    let buttonPosX = mouseX - buttonWidth / 2;
    let buttonPosY = mouseY - buttonHeight / 2;
    const transitionZone = 20;
    let rotateDeg;

    if (mouseX <= halfWidth - transitionZone) {
      rotateDeg = 180; // Nửa trái: prev
      buttonPosX = Math.max(
        offset,
        Math.min(halfWidth - buttonWidth, buttonPosX)
      );
    } else if (mouseX >= halfWidth + transitionZone) {
      rotateDeg = 0; // Nửa phải: next
      buttonPosX = Math.max(
        halfWidth,
        Math.min(rect.width - buttonWidth - offset, buttonPosX)
      );
    } else {
      const progress =
        (mouseX - (halfWidth - transitionZone)) / (transitionZone * 2);
      rotateDeg = 180 - progress * 180; // Vùng chuyển tiếp
      buttonPosX = Math.max(
        offset,
        Math.min(rect.width - buttonWidth - offset, buttonPosX)
      );
    }

    // Giới hạn vị trí Y với offset 40px
    buttonPosY = Math.max(
      offset,
      Math.min(rect.height - buttonHeight - offset, buttonPosY)
    );

    // Áp dụng transform
    swiperButton.style.left = `${buttonPosX}px`;
    swiperButton.style.top = `${buttonPosY}px`;
    swiperButton.style.transform = `scale(1) rotate(${rotateDeg}deg)`;
    swiperButton.style.transition = " transform 0.3s";
  });

  // Xử lý sự kiện mouseleave
  parentContainer.addEventListener("mouseleave", () => {
    swiperButton.style.opacity = "0";
    swiperButton.style.transform = "scale(0)";
    swiperButton.style.transition = "opacity 0.3s, transform 0.3s";
    lastMouseX = null;
  });

  // Xử lý sự kiện click
  swiperButton.addEventListener("click", (e) => {
    const rect = container.getBoundingClientRect();
    const halfWidth = rect.width / 2;
    const currentIndex = bannerSwiper.activeIndex;
    const totalSlides = bannerSwiper.slides.length;

    // Lấy vị trí chuột tại thời điểm click
    const mouseX = lastMouseX !== null ? lastMouseX : e.clientX - rect.left;

    if (mouseX <= halfWidth) {
      if (currentIndex > 0) {
        bannerSwiper.slidePrev();
        console.log("slidePrev called");
      } else {
        console.log("Cannot slidePrev: at first slide");
      }
    } else {
      if (currentIndex < totalSlides - 1) {
        bannerSwiper.slideNext();
        console.log("slideNext called");
      } else {
        console.log("Cannot slideNext: at last slide");
      }
    }
  });
}

function accomodationnFilter() {
  if ($(".accomodation-list").length < 1) return;

  gsap.set(".accomodation-list .nav-tabs", {
    opacity: 0,
    y: 20,
  });

  ScrollTrigger.create({
    trigger: ".accomodation-list",
    start: "top 80%",
    end: "bottom bottom",
    onEnter: showTabs,
    onEnterBack: showTabs,
    onLeave: hideTabs,
    onLeaveBack: hideTabs,
  });

  function showTabs() {
    gsap.to(".accomodation-list .nav-tabs", {
      opacity: 1,
      y: 0,
      duration: 0.3,
      ease: "none",
    });
  }

  function hideTabs() {
    gsap.to(".accomodation-list .nav-tabs", {
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: "none",
    });
  }
}
function zoomInBanner() {
  gsap.registerPlugin(ScrollTrigger);
  let img = document.querySelector(".section-banner__wrapper picture img");
  gsap.set(img, {
    scale: 1.1,
  });
  gsap.to(img, {
    scale: 1,
    duration: 1,
    ease: "none",
    scrollTrigger: {
      trigger: ".section-banner",
      start: "top top",
      end: "bottom 70%",
      scrub: 1,
      // markers: true,
    },
  });
}
const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  zoomInBanner();
  updateSvgHeight();
  fadeTextFooter();
  headerMenu();
  scrollHeader();
  animationArt();
  sectionSlider();
  animationMaskCentral();
  swiperOffer();
  animationText();
  imgWithText();
  swiperRestaurant();
  toggleDropdown();
  gallery();
  swiperBanner();
  // scrollMap();
  animationLineMap();
  swiperAct();
  magicCursor();
  detailSlider();
  modalBooking();
  contactForm();
  getNewletter();
  accomodationnFilter();
  ScrollTrigger.refresh();
};
togglePlayMusic();
// window.addEventListener("resize", () => {
//   animationText();
// });
preloadImages("img").then(() => {
  // Once images are preloaded, remove the 'loading' indicator/class from the body

  init();
});

$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
