document.addEventListener("DOMContentLoaded", function () {
  // Initialize series buttons swiper with freeMode
  const seriesButtonsSwiper = document.querySelector(".series-buttons-swiper");
  if (seriesButtonsSwiper) {
    new Swiper(seriesButtonsSwiper, {
      freeMode: true,
      slidesPerView: "auto",
      spaceBetween: 16,
      grabCursor: true,
      scrollbar: {
        hide: true,
      },
      breakpoints: {
        1024: {
          spaceBetween: 32,
        },
      },
    });
  }

  // Initialize all swipers on the page
  const swipers = document.querySelectorAll(".series-swiper");

  swipers.forEach((swiperEl) => {
    // Find the corresponding custom pagination for this swiper
    const swiperContainer = swiperEl.closest(".border");
    const paginationContainer = swiperContainer
      ? swiperContainer.querySelector(".custom-pagination")
      : null;

    if (!paginationContainer) return;

    const swiper = new Swiper(swiperEl, {
      loop: true,
      on: {
        init: function () {
          updateCustomPagination(this, paginationContainer);
        },
        slideChange: function () {
          updateCustomPagination(this, paginationContainer);
        },
      },
    });

    // Update custom pagination based on active slide
    function updateCustomPagination(swiperInstance, paginationEl) {
      const bullets = paginationEl.querySelectorAll(".pagination-bullet");
      const realIndex = swiperInstance.realIndex; // Get real index (accounts for loop)

      bullets.forEach((bullet, index) => {
        if (index === realIndex) {
          bullet.classList.remove("bg-main-silver");
          bullet.classList.add("bg-main-yellow");
        } else {
          bullet.classList.remove("bg-main-yellow");
          bullet.classList.add("bg-main-silver");
        }
      });
    }

    // Make pagination bullets clickable
    const bullets = paginationContainer.querySelectorAll(".pagination-bullet");
    bullets.forEach((bullet, index) => {
      bullet.addEventListener("click", () => {
        swiper.slideToLoop(index);
      });
    });
  });
});
