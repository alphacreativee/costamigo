import { preloadImages } from "../../libs/utils.js";
let lenis;
Splitting();

("use strict");
$ = jQuery;

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
      allowTouchMove: false,
    });

    const swiperMain = new Swiper(mainSwiperEl, {
      effect: "fade",
      loop: false,
      pagination: {
        el: paginationEl,
        clickable: true,
        type: "progressbar",
      },
      navigation: {
        nextEl: btnNext, // Sử dụng nút tùy chỉnh
        prevEl: btnPrev,
      },
      breakpoints: {
        // Trên hoặc bằng 992px
        991: {
          navigation: {
            nextEl: swiperButton, // Sử dụng nút mặc định của Swiper
            prevEl: swiperButton,
          },
          pagination: {
            el: paginationEl,
            clickable: true,
            type: "fraction",
          },
        },
      },
      on: {
        slideChange: function () {
          swiperContent.slideTo(this.realIndex);
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
        let rotateDeg;

        if (mouseX <= halfWidth - transitionZone) {
          // Nửa trái: prev, mũi tên hướng trái (180deg)
          rotateDeg = 180;
          buttonPosX = Math.max(
            -0,
            Math.min(halfWidth - buttonWidth, buttonPosX)
          );
        } else if (mouseX >= halfWidth + transitionZone) {
          // Nửa phải: next, mũi tên hướng phải (360deg, tương đương 0deg)
          rotateDeg = 360;
          buttonPosX = Math.max(
            halfWidth,
            Math.min(rect.width - buttonWidth + 0, buttonPosX)
          );
        } else {
          // Vùng chuyển tiếp: xoay từ 180deg đến 360deg (lên trên)
          const progress =
            (mouseX - (halfWidth - transitionZone)) / (transitionZone * 2);
          rotateDeg = 180 + progress * 180; // Từ 180deg -> 360deg
          buttonPosX = Math.max(
            -0,
            Math.min(rect.width - buttonWidth + 0, buttonPosX)
          );
        }

        // Giới hạn vị trí Y
        buttonPosY = Math.max(
          -0,
          Math.min(rect.height - buttonHeight + 0, buttonPosY)
        );

        // Áp dụng vị trí và xoay
        swiperButton.style.left = `${buttonPosX}px`;
        swiperButton.style.top = `${buttonPosY}px`;
        swiperButton.style.transform = `scale(1) rotate(${rotateDeg}deg)`;
      });

      // Gán sự kiện click một lần duy nhất
      swiperButton.addEventListener("click", () => {
        const rect = mainSwiperEl.getBoundingClientRect();
        const halfWidth = rect.width / 2;
        const currentIndex = swiperMain.activeIndex;
        const totalSlides = swiperMain.slides.length;
        console.log("123");

        if (lastMouseX <= halfWidth) {
          // Nửa trái: gọi slidePrev nếu không ở slide đầu
          if (currentIndex > 0) {
            swiperMain.slidePrev();
          } else {
            console.log("Cannot slidePrev: at first slide");
          }
        } else {
          // Nửa phải: gọi slideNext nếu không ở slide cuối
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

  $(".image-with-text").each(function () {
    const section = this;

    gsap.to($(section).find(".content-box "), {
      yPercent: -10, // Move element upward by 20% of its height
      ease: "none",
      scrollTrigger: {
        trigger: $(section).find(".content-box"),
        start: "top 30%", // Start when the top of the image hits the bottom of the viewport
        end: "bottom top", // End when the bottom of the image hits the top of the viewport
        scrub: true, // Smoothly tie the animation to scroll
      },
    });
  });

  document.querySelectorAll(".image-with-text").forEach((section) => {
    const wrapper = section.querySelector(".section-wrapper");
    const image = section.querySelector(".section-wrapper img");

    if (!wrapper || !image) return;

    // Animate clip-path
    gsap.fromTo(
      wrapper,
      {
        clipPath: "inset(0% 0% 0% 0%)",
      },
      {
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "bottom 70%",
          // scrub: 1
        },
        clipPath: () => {
          const viewportWidth = window.innerWidth;
          let targetWidth = viewportWidth - 32;
          if (viewportWidth > 991) {
            targetWidth = viewportWidth - 80;
          } else if (viewportWidth > 767) {
            targetWidth = viewportWidth - 80;
          } else {
            targetWidth = viewportWidth - 32;
          }

          const widthClipPercentage =
            ((viewportWidth - targetWidth) / 2 / viewportWidth) * 100;

          const currentHeight = section.offsetHeight;
          const targetHeight =
            viewportWidth > 991 ? currentHeight - 100 : currentHeight;
          const heightClipPixels = (currentHeight - targetHeight) / 2;
          const heightClipPercentage = (heightClipPixels / currentHeight) * 100;

          return `inset(${heightClipPercentage}% ${widthClipPercentage}% ${heightClipPercentage}% ${widthClipPercentage}%)`;
        },
        duration: 1,
        ease: "power2.out",
      }
    );

    // Animate scale image
    gsap.fromTo(
      image,
      {
        scale: 1,
      },
      {
        scrollTrigger: {
          trigger: wrapper,
          start: "top 70%",
          end: "bottom 70%",
          // scrub: 1
        },
        scale: 1.1,
        duration: 1,
        ease: "power2.out",
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
  const fxTitleTwo = document.querySelectorAll(
    "[data-splitting][data-effect-two]"
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

  const swiperAct = new Swiper(".act-slider", {
    slidesPerView: 1,
    effect: isMobile ? "fade" : "slide",
    slidesOffsetAfter: 0,
    breakpoints: {
      991: {
        slidesPerView: 1.4,
        slidesOffsetAfter: 76,
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
      slideChange: function () {
        console.log(
          "Current slide index:",
          this.activeIndex,
          "Total slides:",
          this.slides.length
        );
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
    if (window.innerWidth >= 991) {
      swiperAct.changeLanguageDirection("rtl");
    } else {
      swiperAct.changeLanguageDirection("ltr"); // Optional: Reset to LTR for smaller screens
    }
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
      console.log(
        "Mouse moved - lastMouseX:",
        lastMouseX,
        "halfWidth:",
        halfWidth
      );

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

      console.log(
        "Button clicked - lastMouseX:",
        lastMouseX,
        "currentIndex:",
        currentIndex,
        "totalSlides:",
        totalSlides
      );

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

        console.log("scroll Y 0");
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
      yPercent: 25, // Move element downward by 20% of its height
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

  tl.from(".sub-menu ul li", {
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 0.3,
    ease: "power2.out",
  });

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
        success: function (response) {
          if (response.success) {
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

    lastMouseX = mouseX;

    // Hiển thị nút
    swiperButton.style.opacity = "1";
    swiperButton.style.transition = "opacity 0.3s, transform 0.3s";

    // Tính toán vị trí
    let buttonPosX = mouseX - buttonWidth / 2;
    let buttonPosY = mouseY - buttonHeight / 2;
    const transitionZone = 0;
    let rotateDeg;

    if (mouseX <= halfWidth - transitionZone) {
      rotateDeg = 180; // Nửa trái: prev
      buttonPosX = Math.max(0, Math.min(halfWidth - buttonWidth, buttonPosX));
    } else if (mouseX >= halfWidth + transitionZone) {
      rotateDeg = 0; // Nửa phải: next
      buttonPosX = Math.max(
        halfWidth,
        Math.min(rect.width - buttonWidth, buttonPosX)
      );
    } else {
      const progress =
        (mouseX - (halfWidth - transitionZone)) / (transitionZone * 2);
      rotateDeg = 180 - progress * 180; // Vùng chuyển tiếp
      buttonPosX = Math.max(0, Math.min(rect.width - buttonWidth, buttonPosX));
    }

    // Giới hạn vị trí Y
    buttonPosY = Math.max(0, Math.min(rect.height - buttonHeight, buttonPosY));

    // Áp dụng transform
    swiperButton.style.left = `${buttonPosX}px`;
    swiperButton.style.top = `${buttonPosY}px`;
    swiperButton.style.transform = `scale(1) rotate(${rotateDeg}deg)`;
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
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.3,
          ease: "sine.out"
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
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "sine.out",
          delay: delay
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
        wordClass: "split-word"
      });

      myDesc.lines.forEach((line, index) => {
        tl.fromTo(
          line.querySelectorAll(".split-word"),
          {
            y: "100%",
            opacity: 0
          },
          {
            y: "0%",
            opacity: 1,
            duration: 0.2,
            ease: "none",
            delay: index * 0.01
          }
        );
      });
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
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.1,
          ease: "none"
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
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "sine.out",
          stagger: 0.1
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

    if (isNameFilled && isEmailFilled && isPhoneFilled && isChecked) {
      submitButton.removeAttr("disabled");
    } else {
      submitButton.attr("disabled", true);
    }
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

    if (!checkbox.is(":checked")) {
      checkbox.addClass("error");
      isValid = false;
    }

    if (!isValid) return;

    $.ajax({
      type: "POST",
      url: ajaxUrl,
      data: {
        action: "submit_contact_form",
        name: nameField.val().trim(),
        email: emailField.val().trim(),
        phone: phoneField.val().trim(),
        messageNote: messageField.val().trim()
      },
      beforeSend: function () {
        $(".contact-message").remove();
      },
      success: function (res) {
        $(".contact-message").remove();
        contactForm[0].reset();
        $("#modalBookingSuccess").modal("show");
        submitButton.attr("disabled", true); // Disable lại sau khi gửi
      },
      error: function (xhr, status, error) {
        console.error("Lỗi khi gửi form:", error);
        $(".contact-message").remove();
        contactForm.append(
          '<span class="contact-message" style="color: red;">Có lỗi xảy ra, vui lòng thử lại sau.</span>'
        );
      }
    });
  });
}

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
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
  // scrollMap();
  animationLineMap();
  swiperAct();
  magicCursor();
  detailSlider();
  modalBooking();
  contactForm();
  ScrollTrigger.refresh();
};
togglePlayMusic();
window.addEventListener("resize", () => {
  animationText();
});
preloadImages("img").then(() => {
  // Once images are preloaded, remove the 'loading' indicator/class from the body

  init();
});
