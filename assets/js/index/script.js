import { preloadImages } from "../../libs/utils.js";
let lenis;
Splitting();

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
      swiperButton.style.transform = `rotate(${rotateDeg}deg)`;
    });

    mainSwiperEl.addEventListener("mouseleave", () => {
      swiperButton.style.opacity = "0";
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
        start: "top 80px",
        toggleActions: "play none none none",
      },
    });

    gsap.to($(section).find(".mask.bottom"), {
      y: "100%",
      duration: 1.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 80px",
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
  const fxTitle = document.querySelectorAll(
    "[data-splitting][data-effect-one]"
  );
  const fxTitleTwo = document.querySelectorAll(
    "[data-splitting][data-effect-two]"
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
}
function swiperRestaurant() {
  if (document.querySelector(".swiper-restaurant").length < 1) return;
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

  // Khởi tạo Swiper
  var swiperAct = new Swiper(".act-slider", {
    slidesPerView: 1.45,
    // spaceBetween: 32,
    // slidesOffsetAfter: 200,
    pagination: {
      el: ".section-act__slider .swiper-pagination",
      clickable: true,
      type: "fraction",
    },
    // Không dùng navigation mặc định vì chúng ta sẽ tự xử lý
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
      swiperBtnAct.style.transform = `rotate(${rotateDeg}deg)`;
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
  gsap.registerPlugin(ScrollTrigger);

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
}
function scrollHeader() {
  ScrollTrigger.refresh();

  ScrollTrigger.create({
    start: "top top",
    end: 99999,
    onUpdate: (self) => {
      const header = document.querySelector("header");
      console.log(self.progress);

      // Remove scrolled class when progress is exactly 0
      if (self.progress === 0) {
        header.classList.remove("scrolled");
      }

      // Toggle scrolled class based on progress threshold
      if (self.progress > 0.004) {
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
    // Initial animation (fade and clip-path reveal)
    gsap.to(image, {
      scrollTrigger: {
        trigger: image,
        start: "top 60%",
        end: "bottom 60%",
        onEnter: () => image.classList.add("show"),
        // optional: if you want it to reverse too

        // markers: true,
      },
    });

    // Parallax effect
    gsap.to(image, {
      yPercent: 20, // Move element upward by 20% of its height
      ease: "none",
      scrollTrigger: {
        trigger: image,
        start: "top bottom", // Start when the top of the image hits the bottom of the viewport
        end: "bottom top", // End when the bottom of the image hits the top of the viewport
        scrub: true, // Smoothly tie the animation to scroll
        markers: false, // Set to true for debugging
      },
    });
  });

  const animationArtReverse = document.querySelectorAll(
    ".animation-art-reverse"
  );

  animationArtReverse.forEach((imageR) => {
    // Initial animation (slide in from right)
    gsap.to(imageR, {
      scrollTrigger: {
        trigger: imageR,
        start: "top 60%",
        end: "bottom 60%",
        onEnter: () => imageR.classList.add("show"),
        // optional: if you want it to reverse too

        // markers: true,
      },
    });

    // Parallax effect
    gsap.to(imageR, {
      yPercent: -15, // Move element downward by 20% of its height
      ease: "none",
      scrollTrigger: {
        trigger: imageR,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
}
function headerMenu() {
  let btnMenu = document.querySelector(".btn-hamburger");
  let containerMenu = document.querySelector(".header-sub-menu");
  let tl = gsap.timeline({ paused: true });

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
}
const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  headerMenu();
  scrollHeader();
  animationArt();
  sectionSlider();
  animationMaskCentral();
  swiperOffer();
  animationText();
  imgWithText();
  swiperRestaurant();

  // scrollMap();
  animationLineMap();
  swiperAct();
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
// window.onpageshow = function (event) {
//   if (event.persisted) {
//     window.location.reload();
//   }
// };
