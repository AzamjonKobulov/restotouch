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

document.addEventListener("DOMContentLoaded", function () {
  initCartPriceSticky();

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
