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
    const swiperButton = section.querySelector(".swiper-btn-custom"); // Nút duy nhất

    const swiperContent = new Swiper(contentSwiperEl, {
      loop: false,
      effect: "fade",
      allowTouchMove: false,
    });

    const swiperMain = new Swiper(mainSwiperEl, {
      effect: "fade",
      loop: true,
      navigation: {
        nextEl: swiperButton, // Gắn nút cho next
        prevEl: swiperButton, // Gắn nút cho prev
      },
      pagination: {
        el: paginationEl,
        clickable: true,
        type: "fraction",
      },
      on: {
        slideChange: function () {
          const realIndex = this.realIndex;
          swiperContent.slideTo(realIndex);
        },
      },
    });

    mainSwiperEl.addEventListener("mousemove", (e) => {
      const rect = mainSwiperEl.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const halfWidth = rect.width / 2;

      const buttonWidth = swiperButton.offsetWidth;
      const buttonHeight = swiperButton.offsetHeight;

      // Hiển thị nút
      swiperButton.style.opacity = "1";
      swiperButton.style.transform = "scale(1)";

      // Tính toán vị trí
      let buttonPosX = mouseX - buttonWidth / 2;
      let buttonPosY = mouseY - buttonHeight / 2;

      // Xác định góc xoay dựa trên vị trí chuột
      const transitionZone = 50; // Vùng chuyển tiếp
      let rotateDeg;

      if (mouseX <= halfWidth - transitionZone) {
        // Bên trái hoàn toàn: prev (giả sử mũi tên hướng trái là 180deg)
        rotateDeg = 180;
        buttonPosX = Math.max(0, Math.min(halfWidth - buttonWidth, buttonPosX));
      } else if (mouseX >= halfWidth + transitionZone) {
        // Bên phải hoàn toàn: next (giả sử mũi tên hướng phải là 0deg)
        rotateDeg = 0;
        buttonPosX = Math.max(
          halfWidth,
          Math.min(rect.width - buttonWidth, buttonPosX)
        );
      } else {
        // Vùng chuyển tiếp: xoay dần từ 180deg (prev) sang 0deg (next)
        const progress =
          (mouseX - (halfWidth - transitionZone)) / (transitionZone * 2);
        rotateDeg = 180 - progress * 180; // Từ 180deg -> 0deg
        buttonPosX = Math.max(
          0,
          Math.min(rect.width - buttonWidth, buttonPosX)
        );
      }

      // Giới hạn vị trí Y
      buttonPosY = Math.max(
        0,
        Math.min(rect.height - buttonHeight, buttonPosY)
      );

      // Áp dụng vị trí và xoay
      swiperButton.style.left = `${buttonPosX}px`;
      swiperButton.style.top = `${buttonPosY}px`;
      swiperButton.style.transform = `scale(1) rotate(${rotateDeg}deg)`;
    });

    mainSwiperEl.addEventListener("mouseleave", () => {
      swiperButton.style.opacity = "0";
      swiperButton.style.transform = "scale(0)";
    });
  });
}

function imgWithText() {
  if ($(".image-with-text").length < 1) return;

  gsap.registerPlugin(ScrollTrigger);

  $(".image-with-text").each(function () {
    const section = this;

    gsap.to($(section).find(".mask.top"), {
      y: "-100%",
      duration: 1.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 20%",
        toggleActions: "play none none none",
        // markers: true
      },
    });

    gsap.to($(section).find(".mask.bottom"), {
      y: "100%",
      duration: 1.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 20%",
        toggleActions: "play none none none",
      },
    });
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
}

function animationMaskCentral() {
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
          start: "top 70%",
          end: "bottom 70%",
        },
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "sine.out",
        stagger: 0.1,
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
        stagger: 0.1,
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

  const swiperBtnAct = document.querySelector(".act-slider .swiper-btn-act");
  const container = document.querySelector(".act-slider");
  const swiperActContent = document.querySelector(".swiper-act-content");
  var swiperActC = new Swiper(".swiper-act-content", {
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

  var swiperAct = new Swiper(".act-slider", {
    slidesPerView: 1.45,
    speed: 1000,
    pagination: {
      el: ".section-act__slider .swiper-pagination",
      clickable: true,
      type: "fraction",
    },
    thumbs: {
      swiper: swiperActC,
    },
  });

  // Đổi hướng sang rtl
  swiperAct.changeLanguageDirection("rtl");

  // Kiểm tra xem swiperBtnAct và container có tồn tại không
  if (swiperBtnAct && container) {
    container.addEventListener("mousemove", (e) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const halfWidth = rect.width / 2;

      const buttonWidth = swiperBtnAct.offsetWidth;
      const buttonHeight = swiperBtnAct.offsetHeight;

      // Hiển thị nút
      swiperBtnAct.style.opacity = "1";
      swiperBtnAct.style.transform = "scale(1)";

      // Tính toán vị trí
      let buttonPosX = mouseX - buttonWidth / 2;
      let buttonPosY = mouseY - buttonHeight / 2;

      // Xác định góc xoay dựa trên vị trí chuột
      const transitionZone = 0;
      let rotateDeg;

      if (mouseX <= halfWidth - transitionZone) {
        // Bên trái: prev (mũi tên hướng trái, 180deg)
        rotateDeg = 0;
        buttonPosX = Math.max(0, Math.min(halfWidth - buttonWidth, buttonPosX));
      } else if (mouseX >= halfWidth + transitionZone) {
        // Bên phải: next (mũi tên hướng phải, 0deg)
        rotateDeg = 180;
        buttonPosX = Math.max(
          halfWidth,
          Math.min(rect.width - buttonWidth, buttonPosX)
        );
      } else {
        // Vùng chuyển tiếp
        const progress =
          (mouseX - (halfWidth - transitionZone)) / (transitionZone * 2);
        rotateDeg = 180 - progress * 180;
        buttonPosX = Math.max(
          0,
          Math.min(rect.width - buttonWidth, buttonPosX)
        );
      }

      // Giới hạn vị trí Y
      buttonPosY = Math.max(
        0,
        Math.min(rect.height - buttonHeight, buttonPosY)
      );

      // Áp dụng vị trí và xoay
      swiperBtnAct.style.left = `${buttonPosX}px`;
      swiperBtnAct.style.top = `${buttonPosY}px`;
      swiperBtnAct.style.transform = `scale(1) rotate(${rotateDeg}deg)`;
    });

    // Thêm sự kiện click để chuyển slide
    swiperBtnAct.addEventListener("click", (e) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const halfWidth = rect.width / 2;

      if (mouseX <= halfWidth) {
        // Bên trái: prev
        // swiperAct.slidePrev();
        swiperAct.slideNext();
      } else {
        // Bên phải: next
        swiperAct.slidePrev();
      }
    });

    container.addEventListener("mouseleave", () => {
      swiperBtnAct.style.opacity = "0";
      swiperBtnAct.style.transform = "scale(0)";
    });
  } else {
    console.error("Không tìm thấy .swiper-btn-act hoặc .act-slider");
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

  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

  gsap.to("#maskRect", {
    height: 5989, // bằng chiều cao SVG
    ease: "none",
    scrollTrigger: {
      trigger: ".svg-container",
      start: "top center",
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
  let btnMenu = document.querySelector(".btn-hamburger");
  let containerMenu = document.querySelector(".header-sub-menu");
  let tl = gsap.timeline({ paused: true });
  const sub_menu_overlay = document.querySelector(".sub-menu-overlay");

  tl.from(".sub-menu ul li", {
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 0.3,
    ease: "power2.out",
  });

  btnMenu.addEventListener("click", () => {
    containerMenu.classList.toggle("show");
    btnMenu.classList.toggle("change");
    if (containerMenu.classList.contains("show")) {
      tl.restart();
      document.body.classList.add("overflow-hidden");
    } else {
      tl.reverse();
      document.body.classList.remove("overflow-hidden");
    }
  });

  sub_menu_overlay.addEventListener("click", () => {
    tl.reverse();
    btnMenu.classList.remove("change");
    containerMenu.classList.remove("show");
    document.body.classList.remove("overflow-hidden");
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

  // Verify time input field exists
  const timeField = $('[name="booking-hour"]');
  if (timeField.length === 0) {
    console.error('Input field [name="booking-hour"] not found');
    return;
  }

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

  const items = document.querySelectorAll(".modal, [data-cursor-text]");
  var cursorDot = document.querySelector(".magic-cursor .cursor");
  var cursorText = document.querySelector(".magic-cursor .cursor .text");

  items.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      let text = "";
      if (item.classList.contains("modal")) {
        text = "Đóng";
      } else {
        text = item.getAttribute("data-cursor-text");
      }

      // const text = item.getAttribute("data-cursor-text");
      cursorText.innerHTML = `<span class="b2-regular color-white">${text}</span>`;
      cursorDot.classList.add("show-text");
    });

    item.addEventListener("mouseleave", () => {
      cursorText.innerHTML = "";
      cursorDot.classList.remove("show-text");
    });
  });

  const itemsContent = document.querySelectorAll(".modal-dialog");
  itemsContent.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      cursorDot.classList.remove("show-text");
    });
    item.addEventListener("mouseleave", () => {
      cursorText.innerHTML = `<span class="b2-regular color-white">Đóng</span>`;
      cursorDot.classList.add("show-text");
    });
  });
}

function detailSlider() {
  if ($(".detail-slider").length < 1) return;

  var interleaveOffset = 0.9;

  var detailSlider = new Swiper(".detail-slider", {
    loop: false,
    speed: 1500,
    grabCursor: true,
    watchSlidesProgress: true,
    mousewheelControl: true,
    keyboardControl: true,
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
}

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  updateSvgHeight();
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
