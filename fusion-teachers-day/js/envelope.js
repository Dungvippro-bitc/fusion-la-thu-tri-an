// Phong bì là nút tương tác; khóa ngay lần kích hoạt đầu để tránh mở lặp.
function setupEnvelopeAnimation(onComplete) {
  const stage = document.getElementById("envelope-stage");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let opening = false;
  let timerId;

  stage.addEventListener("click", () => {
    if (opening) return;
    opening = true;
    stage.disabled = true;
    if (!reducedMotion.matches) stage.classList.add("is-opening");
    timerId = window.setTimeout(onComplete, reducedMotion.matches ? 0 : 2450);
  });

  return {
    reset() {
      window.clearTimeout(timerId);
      opening = false;
      stage.disabled = false;
      stage.classList.remove("is-opening");
    }
  };
}
