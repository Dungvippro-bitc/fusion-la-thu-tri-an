// Chuẩn hóa Unicode, chữ Đ/đ và khoảng trắng để tìm tên nhất quán.
function normalizeName(value) {
  return value.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function levenshtein(a, b) {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    let diagonal = previous[0];
    previous[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const old = previous[j];
      previous[j] = Math.min(
        previous[j] + 1,
        previous[j - 1] + 1,
        diagonal + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      diagonal = old;
    }
  }
  return previous[b.length];
}

// Điểm thấp hơn được ưu tiên: trùng tên, chứa cụm từ, khớp từng từ, rồi lỗi gõ nhẹ.
function matchScore(query, fullName) {
  if (fullName === query) return 0;
  if (fullName.includes(query)) return 1 + (fullName.length - query.length) / 100;

  const queryWords = query.split(" ");
  const nameWords = fullName.split(" ");
  if (queryWords.every((word) => nameWords.some((nameWord) => nameWord.startsWith(word)))) {
    return 2 + (nameWords.length - queryWords.length) / 100;
  }

  const allowedErrors = query.length >= 9 ? 2 : 1;
  let best = Infinity;
  // So với các cụm từ liền nhau có độ dài tương đương để hạn chế gợi ý không liên quan.
  for (let start = 0; start < nameWords.length; start += 1) {
    for (let length = Math.max(1, queryWords.length - 1); length <= Math.min(nameWords.length - start, queryWords.length + 1); length += 1) {
      const candidate = nameWords.slice(start, start + length).join(" ");
      if (Math.abs(candidate.length - query.length) <= allowedErrors) {
        best = Math.min(best, levenshtein(query, candidate));
      }
    }
  }
  return best <= allowedErrors ? 3 + best / 10 : Infinity;
}

function findTeacherMatches(rawQuery) {
  const query = normalizeName(rawQuery);
  if (!query) return [];
  return teachers
    .map((teacher) => ({ teacher, score: matchScore(query, normalizeName(teacher.name)) }))
    .filter(({ score }) => Number.isFinite(score))
    .sort((a, b) => a.score - b.score || a.teacher.name.localeCompare(b.teacher.name, "vi"));
}

function findTeachers(rawQuery) {
  return findTeacherMatches(rawQuery).map(({ teacher }) => teacher);
}

function setupTeacherSearch(onSelect) {
  const form = document.getElementById("welcome-form");
  const input = document.getElementById("welcome-name");
  const list = document.getElementById("search-results");
  const status = document.getElementById("search-status");
  let matches = [];
  let activeIndex = -1;

  function closeList() {
    list.hidden = true;
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    activeIndex = -1;
  }

  function openList() {
    if (matches.length === 0) return;
    list.hidden = false;
    input.setAttribute("aria-expanded", "true");
  }

  function setActive(index) {
    const options = [...list.querySelectorAll('[role="option"]')];
    if (!options.length) return;
    activeIndex = (index + options.length) % options.length;
    options.forEach((option, optionIndex) => {
      option.setAttribute("aria-selected", String(optionIndex === activeIndex));
    });
    input.setAttribute("aria-activedescendant", options[activeIndex].id);
    options[activeIndex].scrollIntoView({ block: "nearest" });
  }

  function choose(teacher) {
    closeList();
    onSelect(teacher);
  }

  function render() {
    matches = findTeacherMatches(input.value);
    list.replaceChildren();
    activeIndex = -1;
    input.removeAttribute("aria-activedescendant");
    if (!normalizeName(input.value)) {
      status.textContent = "";
      closeList();
      return;
    }
    if (matches.length === 0) {
      status.textContent = "Chưa tìm thấy tên phù hợp. Thầy/Cô vui lòng kiểm tra lại nhé!";
      closeList();
      return;
    }

    matches.forEach(({ teacher }, index) => {
      const option = document.createElement("li");
      option.id = `teacher-option-${index}`;
      option.className = "search-option";
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", "false");
      const name = document.createElement("span");
      name.className = "result-name";
      name.textContent = teacher.name;
      const honorific = document.createElement("span");
      honorific.className = "result-honorific";
      honorific.textContent = teacher.honorific;
      option.append(name, honorific);
      option.addEventListener("click", () => choose(teacher));
      list.append(option);
    });
    status.textContent = matches.length > 1
      ? `${matches.length} tên phù hợp. Thầy/Cô vui lòng chọn đúng tên của mình.`
      : "Chọn tên gợi ý hoặc nhấn Enter để tiếp tục.";
    openList();
  }

  function confirmFromInput() {
    if (!list.hidden && activeIndex >= 0) {
      choose(matches[activeIndex].teacher);
      return;
    }
    const exact = matches.filter(({ score }) => score === 0);
    if (exact.length === 1) {
      choose(exact[0].teacher);
      return;
    }
    // Một kết quả khớp rõ ràng theo tên rút gọn có thể mở bằng Enter.
    // Kết quả chỉ gần đúng vẫn cần click hoặc Arrow + Enter để xác nhận.
    if (matches.length === 1 && matches[0].score < 3) {
      choose(matches[0].teacher);
      return;
    }
    if (matches.length > 0) {
      openList();
      status.textContent = "Thầy/Cô vui lòng chọn đúng tên trong danh sách gợi ý.";
    }
  }

  input.addEventListener("input", render);
  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (matches.length === 0) return;
      event.preventDefault();
      openList();
      setActive(activeIndex < 0 ? (event.key === "ArrowDown" ? 0 : matches.length - 1) : activeIndex + (event.key === "ArrowDown" ? 1 : -1));
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeList();
    } else if (event.key === "Enter") {
      event.preventDefault();
      confirmFromInput();
    }
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    confirmFromInput();
  });
  return { input, render };
}
