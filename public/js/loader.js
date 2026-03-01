(() => {
  const createLoader = () => {
    if (document.getElementById("page-loader")) return;
    const loader = document.createElement("div");
    loader.id = "page-loader";
    loader.setAttribute("aria-hidden", "true");
    loader.innerHTML = '<div class="page-loader__spinner" aria-label="Loading"></div>';
    document.body.prepend(loader);
  };

  const hideLoader = () => {
    const el = document.getElementById("page-loader");
    if (el) el.classList.add("page-loader--hide");
  };

  const init = () => {
    createLoader();
    window.addEventListener("load", hideLoader);
    // Fallback in case load is delayed
    setTimeout(hideLoader, 4000);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

