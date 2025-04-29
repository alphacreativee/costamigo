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
    const prevBtn = section.querySelector(".swiper-button-prev");
    const nextBtn = section.querySelector(".swiper-button-next");

    const swiperContent = new Swiper(contentSwiperEl, {
      loop: false,
      effect: "fade",
      allowTouchMove: false,
    });

    const swiperMain = new Swiper(mainSwiperEl, {
      effect: "fade",
      loop: false,
      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn,
      },
      pagination: {
        el: paginationEl,
        clickable: true,
        type: "fraction",
      },
      on: {
        slideChange: function () {
          swiperContent.slideTo(this.realIndex);
        },
      },
    });

    mainSwiperEl.addEventListener("mousemove", (e) => {
      const rect = mainSwiperEl.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const halfWidth = rect.width / 2;

      const buttonWidth = prevBtn.offsetWidth;
      const buttonHeight = prevBtn.offsetHeight;

      // Tính vị trí chung
      const posX = mouseX - buttonWidth / 2;
      const posY = mouseY - buttonHeight / 2;

      // Reset ẩn
      prevBtn.style.opacity = "0";
      nextBtn.style.opacity = "0";
      prevBtn.style.transform = "scale(0)";
      nextBtn.style.transform = "scale(0)";

      if (mouseX <= halfWidth) {
        // Hover bên trái -> Hiện prev
        prevBtn.style.opacity = "1";
        prevBtn.style.left = `${Math.max(
          0,
          Math.min(rect.width - buttonWidth, posX)
        )}px`;
        prevBtn.style.top = `${Math.max(
          0,
          Math.min(rect.height - buttonHeight, posY)
        )}px`;
        prevBtn.style.transform = "scale(1) rotate(180deg)";
      } else {
        // Hover bên phải -> Hiện next
        nextBtn.style.opacity = "1";
        nextBtn.style.left = `${Math.max(
          0,
          Math.min(rect.width - buttonWidth, posX)
        )}px`;
        nextBtn.style.top = `${Math.max(
          0,
          Math.min(rect.height - buttonHeight, posY)
        )}px`;
        nextBtn.style.transform = "scale(1) rotate(0deg)";
      }
    });

    mainSwiperEl.addEventListener("mouseleave", () => {
      prevBtn.style.opacity = "0";
      prevBtn.style.transform = "scale(0)";
      nextBtn.style.opacity = "0";
      nextBtn.style.transform = "scale(0)";
    });
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
  if ($(".image-with-text").length < 1) return;

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
          start: "top 65%",
          end: "bottom 65%",
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
          start: "top 85%",
          end: "bottom 85%",
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
          start: "top center",
          end: "top center",
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
          start: "top 50%",
          end: "top 50%",
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
}
function swiperAct() {
  if (!document.querySelector(".act-slider")) return;

  const container = document.querySelector(".act-slider");
  const btnPrev = container.querySelector(".swiper-button-prev");
  const btnNext = container.querySelector(".swiper-button-next");
  const swiperActContent = document.querySelector(".swiper-act-content");

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
    breakpoints: {
      991: {
        slidesPerView: 1.45,
      },
    },
    speed: 1000,
    pagination: {
      el: ".section-act__slider .swiper-pagination",
      clickable: true,
      type: "fraction",
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
  });

  swiperAct.changeLanguageDirection("rtl");

  // Hover effect cho desktop
  if (!isMobile && btnPrev && btnNext && container) {
    container.addEventListener("mousemove", (e) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const halfWidth = rect.width / 2;

      const buttonW = btnPrev.offsetWidth;
      const buttonH = btnPrev.offsetHeight;

      const posX = mouseX - buttonW / 2;
      const posY = mouseY - buttonH / 2;

      const clampedX = Math.max(0, Math.min(rect.width - buttonW, posX));
      const clampedY = Math.max(0, Math.min(rect.height - buttonH, posY));

      // Reset ẩn trước
      btnPrev.style.opacity = "0";
      btnNext.style.opacity = "0";
      btnPrev.style.transform = "scale(0)";
      btnNext.style.transform = "scale(0)";

      if (mouseX <= halfWidth) {
        btnPrev.style.left = `${clampedX}px`;
        btnPrev.style.top = `${clampedY}px`;
        btnPrev.style.transform = "scale(1) rotate(180deg)";
        btnPrev.style.opacity = "1";
        btnPrev.style.zIndex = "2";
        btnNext.style.zIndex = "1";
      } else {
        btnNext.style.left = `${clampedX}px`;
        btnNext.style.top = `${clampedY}px`;
        btnNext.style.transform = "scale(1) rotate(0deg)";
        btnNext.style.opacity = "1";
        btnNext.style.zIndex = "2";
        btnPrev.style.zIndex = "1";
      }
    });

    container.addEventListener("mouseleave", () => {
      btnPrev.style.opacity = "0";
      btnPrev.style.transform = "scale(0)";
      btnNext.style.opacity = "0";
      btnNext.style.transform = "scale(0)";
    });

    // Click handlers
    btnPrev.addEventListener("click", () => swiperAct.slidePrev());
    btnNext.addEventListener("click", () => swiperAct.slideNext());
  }
}

function swiperOffer() {
  if (!document.querySelector(".swiper-offer")) return;
  var swiperOffer = new Swiper(".swiper-offer", {
    slidesPerView: 3,
    spaceBetween: 40,
    navigation: {
      nextEl: ".section-offer__slider .swiper-button-next",
      prevEl: ".section-offer__slider .swiper-button-prev",
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
      const scrollY = window.scrollY;
      if (scrollY === 0) {
        header.classList.remove("scrolled");
      }
      if (self.direction === 1) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
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
      yPercent: 30, // Move element downward by 20% of its height
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
      $("#modalBooking").modal("hide");
      $("#modalBookingSuccess").modal("show");
      this.reset();
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
  if ($(".detail-slider").length < 1) return;

  var interleaveOffset = 0.9;

  var detailSlider = new Swiper(".detail-slider", {
    loop: false,
    speed: 1500,
    watchSlidesProgress: true,
    mousewheelControl: false,
    keyboardControl: false,
    allowTouchMove: false,
    autoplay: false,
    navigation: {
      nextEl: document
        .querySelector(".detail-slider")
        .parentElement.querySelector(".swiper-button-next"),
      prevEl: document
        .querySelector(".detail-slider")
        .parentElement.querySelector(".swiper-button-prev"),
    },
    on: {
      progress: function (swiper) {
        swiper.slides.forEach(function (slide) {
          var slideProgress = slide.progress || 0;
          var innerOffset = swiper.width * interleaveOffset;
          var innerTranslate = slideProgress * innerOffset;
          if (!isNaN(innerTranslate)) {
            var slideInner = slide.querySelector(".detail-slider__image");
            if (slideInner) {
              slideInner.style.transform =
                "translate3d(" + innerTranslate + "px, 0, 0)";
            }
          }
        });
      },
      touchStart: function (swiper) {
        swiper.slides.forEach(function (slide) {
          slide.style.transition = "";
        });
      },
      setTransition: function (swiper, speed) {
        var easing = "cubic-bezier(0.25, 0.1, 0.25, 1)";
        swiper.slides.forEach(function (slide) {
          slide.style.transition = speed + "ms " + easing;
          var slideInner = slide.querySelector(".detail-slider__image");
          if (slideInner) {
            slideInner.style.transition = speed + "ms " + easing;
          }
        });
      },
    },
  });

  // arrowSliderDetails
  const arrowSliderDetails = document.querySelectorAll(
    ".detail-slider__arrows .swiper-button-next,.detail-slider__arrows .swiper-button-prev"
  );

  arrowSliderDetails.forEach((arrowSliderDetail) => {
    const img = arrowSliderDetail.querySelector("img");
    if (!img) return;

    gsap.set(img, {
      opacity: 0,
      scale: 0.8,
      pointerEvents: "none",
    });

    arrowSliderDetail.addEventListener("mouseenter", () => {
      if (arrowSliderDetail.getAttribute("disabled") === "true") return;

      gsap.to(img, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    arrowSliderDetail.addEventListener("mousemove", (e) => {
      if (arrowSliderDetail.getAttribute("disabled") === "true") return;

      const rect = arrowSliderDetail.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gsap.to(img, {
        x: x,
        y: y,
        duration: 0.3,
        ease: "power3.out",
      });
    });

    arrowSliderDetail.addEventListener("mouseleave", () => {
      gsap.to(img, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });
}

function loading() {
  if (!document.querySelector(".loading")) return;
  const loading = document.querySelector(".loading");
  loading.classList.add("loading-out");
  document.body.classList.remove("scroll-hidden");
  setTimeout(() => {
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
    console.error(
      'SVG element not found. Check if ".svg-container svg" exists.'
    );
    return;
  }
  if (!footer) {
    console.error('Footer element not found. Check if "footer" exists.');
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
  lightGallery(document.querySelector(".animated-thumb"), {
    selector: ".thumb-img",
    thumbnail: true,
    download: false,
    height: "100%", // Height of the gallery (ex: '100%' or '300px').
    width: "100%", // Width of the gallery (ex: '100%' or '300px').
    iframeMaxWidth: "100%", // Set maximum width for iframe.
    // mode: "lg-fade",
    subHtmlSelectorRelative: true,
  });
  const prevCursor = document.querySelector(".lg-prev");
  const nextCursor = document.querySelector(".lg-next");
  const gallery = document.querySelector(".lg-container");
  const closeCursor = document.querySelector(".lg-close");

  let isOverClose = false; // trạng thái đang hover nút close

  gallery.addEventListener("mousemove", (e) => {
    if (isOverClose) return; // Nếu đang hover close thì bỏ qua

    const galleryRect = gallery.getBoundingClientRect();
    const centerX = galleryRect.left + galleryRect.width / 2;

    // Move both cursors to follow the mouse
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
      nextCursor.style.transform = "scale(1) translate(-200%, -150%)"; // đảm bảo trở lại scale(1) nếu vừa rời khỏi close
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
      stagger: 0.1,
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

$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});
