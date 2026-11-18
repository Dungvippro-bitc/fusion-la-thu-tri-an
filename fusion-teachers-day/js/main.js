const SCREENS = Object.freeze({
  WELCOME: "welcome",
  ENVELOPE: "envelope",
  GREETING: "greeting"
});

document.addEventListener("DOMContentLoaded", () => {
  const screens = {
    [SCREENS.WELCOME]: document.getElementById("welcome-screen"),
    [SCREENS.ENVELOPE]: document.getElementById("envelope-screen"),
    [SCREENS.GREETING]: document.getElementById("greeting-screen")
  };
  const stage = document.getElementById("envelope-stage");
  const card = document.querySelector(".greeting-card");
  let currentScreen = SCREENS.WELCOME;
  let selectedTeacher = null;

  function showScreen(nextScreen) {
    currentScreen = nextScreen;
    Object.entries(screens).forEach(([key, screen]) => { screen.hidden = key !== nextScreen; });
    window.scrollTo({ top: 0, behavior: "auto" });
    const focusTarget = nextScreen === SCREENS.ENVELOPE
      ? stage
      : screens[nextScreen].querySelector("h1, h2");
    if (focusTarget) {
      if (focusTarget !== stage) focusTarget.tabIndex = -1;
      focusTarget.focus({ preventScroll: true });
    }
  }

  const search = setupTeacherSearch((teacher) => {
    if (currentScreen !== SCREENS.WELCOME) return;
    selectedTeacher = teacher;
    document.getElementById("envelope-title").textContent = `${teacher.honorific} ${teacher.name}`;
    stage.setAttribute("aria-label", `Mở lá thư dành riêng cho ${teacher.honorific} ${teacher.name}`);
    showScreen(SCREENS.ENVELOPE);
  });

  const envelope = setupEnvelopeAnimation(() => {
    if (currentScreen !== SCREENS.ENVELOPE || !selectedTeacher) return;
    const isEnglish = selectedTeacher.language === "en";
    document.getElementById("card-honorific").textContent = selectedTeacher.honorific;
    document.getElementById("card-name").textContent = selectedTeacher.name;
    document.getElementById("card-greeting").textContent = selectedTeacher.greeting;
    document.getElementById("card-title").firstChild.textContent = isEnglish ? "Dear " : "Kính gửi ";
    document.getElementById("card-signature-text").textContent = isEnglish
      ? "With love and gratitude"
      : "Với tất cả sự yêu thương và lòng biết ơn";
    card.lang = isEnglish ? "en" : "vi";
    showScreen(SCREENS.GREETING);
  });

  document.getElementById("home-button").addEventListener("click", () => {
    if (currentScreen !== SCREENS.GREETING) return;
    selectedTeacher = null;
    envelope.reset();
    search.input.value = "";
    search.render();
    document.getElementById("envelope-title").textContent = "";
    document.getElementById("card-honorific").textContent = "";
    document.getElementById("card-name").textContent = "";
    document.getElementById("card-greeting").textContent = "";
    showScreen(SCREENS.WELCOME);
  });

  // Không lưu trạng thái: mỗi lần tải lại luôn bắt đầu từ trang nhập tên.
  document.getElementById("welcome-name").value = "";
  showScreen(SCREENS.WELCOME);
});
