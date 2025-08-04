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
      allowTouchMove: true,
      slidesPerView: 1,
      freeMode: true,
      autoplay: true,
      breakpoints: {
        991: {
          allowTouchMove: false,
          autoplay: false,
        },
      },
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
  });
}
function imgWithText() {
  if ($(".image-with-text").length < 1) return;

  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll(".image-with-text").forEach((section) => {
    if (section.classList.contains("parallax")) return;

    const wrapper = section.querySelector(".section-wrapper");
    const image = section.querySelector(".section-wrapper img");
    const detailSlider = section.querySelector(".detail-slider");

    if (!wrapper || !image || detailSlider) return;

    gsap.set(image, { scale: 1.5 });

    gsap.to(image, {
      scale: 1,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "bottom top",
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

  // let menuHasChilden = $("header .sub-menu .menu-item-has-children a");
  // menuHasChilden.on("click", function (e) {
  //   e.preventDefault();
  //   tl.reverse();
  //   tl2.restart();

  //   let thisItem = $(this);
  //   let thisSubMenu = thisItem.closest(".menu-item-has-children");
  //   thisSubMenu.addClass("open");
  // });

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
  if ($("#modalBooking").length < 1) return;

  const dateField = document.querySelector(
    '#modalBooking [name="booking-startday"]'
  );
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
        $('#modalBooking [name="booking-startday"]').val(
          start.format("DD/MM/YYYY")
        );
        $("#modalBooking .field.date .field-border-bottom").removeClass(
          "error"
        );
      } catch (error) {
        console.error("Error in Lightpick onSelect:", error);
      }
    },
  });

  // Form submission handler
  $("#modalBooking form").on("submit", function (e) {
    e.preventDefault();

    // Validate required fields
    let isValid = true;
    const form = $(this);
    $("#modalBooking .error").removeClass("error");

    const requiredFields = [
      {
        name: "booking-startday",
        errorField: "#modalBooking .field.date .field-border-bottom",
      },
      {
        name: "booking-adult",
        errorField: "#modalBooking .adult.field-border-bottom",
      },
      {
        name: "booking-name",
        errorField: "#modalBooking .name.field-border-bottom",
      },
      {
        name: "booking-phone",
        errorField: "#modalBooking .phone.field-border-bottom",
      },
    ];

    requiredFields.forEach((field) => {
      const input = $(`#modalBooking [name="${field.name}"]`);

      if (!input.val() || input.val().trim() === "") {
        $(field.errorField).addClass("error");
        isValid = false;
      }
    });

    // Validate phone number format
    const phone = $('#modalBooking [name="booking-phone"]').val();
    if (phone && !/^[0-9]{10,11}$/.test(phone)) {
      $("#modalBooking .phone.field-border-bottom").addClass("error");
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
  $(
    '#modalBooking [name="booking-adult"], #modalBooking [name="booking-name"], #modalBooking [name="booking-phone"]'
  ).on("input", function () {
    const parent = $(this).closest(".field-border-bottom");
    if (parent.hasClass("error")) {
      parent.removeClass("error");
    }
  });

  // Show date picker when clicking date input
  $('#modalBooking [name="booking-startday"]').on("click", function () {
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

function loading() {
  const loadingElement = document.querySelector(".loading");
  if (!loadingElement) return;

  // Sử dụng requestAnimationFrame để tối ưu
  requestAnimationFrame(() => {
    loadingElement.classList.add("loading-out");
    document.body.classList.remove("scroll-hidden");
  });

  // Giữ nguyên timing như code gốc
  setTimeout(() => {
    fadeTextPageDetail();
  }, 1000);

  setTimeout(() => {
    document.querySelectorAll(".loading").forEach((element) => {
      element.style.display = "none";
    });
  }, 1500);
}

// Cách 1: Giữ nguyên logic gốc nhưng tối ưu
$(document).ready(function () {
  setTimeout(() => {
    loading();
  }, 2000);
});

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

  return tlf;
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
      const dataDelay = parseFloat(element.dataset.delay) || 500;

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
      }, 500);
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

function zoomInBanner() {
  gsap.registerPlugin(ScrollTrigger);
  let img = document.querySelector(".section-banner__wrapper picture img");
  gsap.set(img, {
    scale: 1.2,
  });
  gsap.to(img, {
    scale: 1,
    duration: 1,
    ease: "none",
    scrollTrigger: {
      trigger: ".section-banner",
      start: "top top",
      end: "bottom top",
      scrub: 1,
      // markers: true,
    },
  });
}

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  zoomInBanner();

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
  swiperAct();
  magicCursor();
  modalBooking();
  ScrollTrigger.refresh();
};
togglePlayMusic();

preloadImages("img").then(() => {
  // Once images are preloaded, remove the 'loading' indicator/class from the body

  init();
});

$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
