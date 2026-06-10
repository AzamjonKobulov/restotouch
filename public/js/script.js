/**
 * Cart price sidebar — sticks to top on scroll (md+), no CSS position: sticky.
 * Needs: [data-cart-price-sticky] > [data-cart-price-track] > [data-cart-price-card]
 */
function initCartPriceSticky() {
  const root = document.querySelector("[data-cart-price-sticky]");
  if (!root) return;

  const track = root.querySelector("[data-cart-price-track]");
  const card = root.querySelector("[data-cart-price-card]");
  if (!track || !card) return;

  const topOffset = 20;
  const mdMinWidth = 768;

  function clearCardPosition() {
    card.style.position = "";
    card.style.top = "";
    card.style.left = "";
    card.style.right = "";
    card.style.bottom = "";
    card.style.width = "";
    card.style.zIndex = "";
  }

  function update() {
    if (window.innerWidth < mdMinWidth) {
      clearCardPosition();
      return;
    }

    const trackRect = track.getBoundingClientRect();
    const cardHeight = card.offsetHeight;

    if (trackRect.top >= topOffset) {
      clearCardPosition();
      return;
    }

    if (trackRect.bottom <= cardHeight + topOffset) {
      card.style.position = "absolute";
      card.style.top = "auto";
      card.style.bottom = "0";
      card.style.left = "0";
      card.style.right = "0";
      card.style.width = "100%";
      card.style.zIndex = "10";
      return;
    }

    card.style.position = "fixed";
    card.style.top = topOffset + "px";
    card.style.left = trackRect.left + "px";
    card.style.width = trackRect.width + "px";
    card.style.bottom = "auto";
    card.style.right = "auto";
    card.style.zIndex = "10";
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  window.addEventListener("load", update);
  update();
}

function initBrandGridSwipers() {
  document.querySelectorAll("[data-brand-grid-slider]").forEach((root) => {
    const swiperEl = root.querySelector(".brand-grid-swiper");
    const paginationEl = root.querySelector(".brand-grid-pagination");
    if (!swiperEl || !paginationEl || typeof Swiper === "undefined") return;

    const swiper = new Swiper(swiperEl, {
      loop: true,
      speed: 500,
      spaceBetween: 16,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      on: {
        init() {
          updateBrandGridPagination(this, paginationEl);
        },
        slideChange() {
          updateBrandGridPagination(this, paginationEl);
        },
      },
      breakpoints: {
        768: {
          spaceBetween: 24,
        },
      },
    });

    function updateBrandGridPagination(swiperInstance, paginationNode) {
      const bullets = paginationNode.querySelectorAll(".pagination-bullet");
      const realIndex = swiperInstance.realIndex;

      bullets.forEach((bullet, index) => {
        if (index === realIndex) {
          bullet.classList.remove("bg-main-gray-200");
          bullet.classList.add("bg-main-yellow");
        } else {
          bullet.classList.remove("bg-main-yellow");
          bullet.classList.add("bg-main-gray-200");
        }
      });
    }

    paginationEl
      .querySelectorAll(".pagination-bullet")
      .forEach((bullet, index) => {
        bullet.addEventListener("click", () => swiper.slideToLoop(index));
      });
  });
}

function initProductsGridCardSwiper() {
  const root = document.querySelector("[data-products-grid-card-slider]");
  if (!root || typeof Swiper === "undefined") return;

  const lgMinWidth = 1024;
  let swiperInstance = null;

  function updatePagination(swiper, paginationEl) {
    const bullets = paginationEl.querySelectorAll(".pagination-bullet");
    const realIndex = swiper.realIndex;

    bullets.forEach((bullet, index) => {
      if (index === realIndex) {
        bullet.classList.remove("bg-main-gray-200");
        bullet.classList.add("bg-main-yellow");
      } else {
        bullet.classList.remove("bg-main-yellow");
        bullet.classList.add("bg-main-gray-200");
      }
    });
  }

  function destroySwiper() {
    if (!swiperInstance) return;
    swiperInstance.destroy(true, true);
    swiperInstance = null;
  }

  function initSwiper() {
    if (window.innerWidth >= lgMinWidth) {
      destroySwiper();
      return;
    }

    if (swiperInstance) return;

    const swiperEl = root.querySelector(".products-grid-card-swiper");
    const paginationEl = root.querySelector(".products-grid-card-pagination");
    if (!swiperEl || !paginationEl) return;

    swiperInstance = new Swiper(swiperEl, {
      loop: true,
      speed: 500,
      spaceBetween: 20,
      slidesPerView: 1,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      on: {
        init() {
          updatePagination(this, paginationEl);
        },
        slideChange() {
          updatePagination(this, paginationEl);
        },
      },
    });

    paginationEl.querySelectorAll(".pagination-bullet").forEach((bullet, index) => {
      bullet.addEventListener("click", () => swiperInstance.slideToLoop(index));
    });
  }

  initSwiper();
  window.addEventListener("resize", initSwiper);
}

function initBrandsLogosSwiper() {
  const root = document.querySelector("[data-brands-logos-slider]");
  const swiperEl = root?.querySelector(".brands-logos-swiper");
  const prevEl = root?.querySelector("[data-brands-logos-prev]");
  const nextEl = root?.querySelector("[data-brands-logos-next]");

  if (!swiperEl || typeof Swiper === "undefined") return;

  new Swiper(swiperEl, {
    loop: true,
    speed: 600,
    slidesPerView: 8,
    spaceBetween: 20,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    navigation: {
      prevEl,
      nextEl,
    },
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initCartPriceSticky();
  initBrandGridSwipers();
  initProductsGridCardSwiper();
  initBrandsLogosSwiper();

  // Initialize all swipers on the page
  const swipers = document.querySelectorAll(".series-swiper");

  swipers.forEach((swiperEl) => {
    // Popular products row manages its own card swipers via Alpine
    if (swiperEl.closest("#products")) return;

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
