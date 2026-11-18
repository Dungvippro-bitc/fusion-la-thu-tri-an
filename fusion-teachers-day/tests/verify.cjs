const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const context = vm.createContext({});
for (const file of ['js/data.js', 'js/search.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
}
const teachers = vm.runInContext('teachers', context);
const findTeachers = vm.runInContext('findTeachers', context);
const findTeacherMatches = vm.runInContext('findTeacherMatches', context);

assert.equal(teachers.length, 24, 'Phải có đúng 24 người nhận');
assert.equal(new Set(teachers.map((teacher) => teacher.id)).size, 24, 'ID phải duy nhất');
assert.equal(new Set(teachers.map((teacher) => teacher.name)).size, 24, 'Tên người nhận phải duy nhất');
assert.equal(new Set(teachers.map((teacher) => teacher.greeting)).size, 24, 'Lời chúc phải độc lập');
assert.equal(teachers.filter((teacher) => teacher.language === 'en').length, 2);
assert.equal(teachers.filter((teacher) => teacher.language === 'vi').length, 22);
for (const teacher of teachers) {
  assert.ok(teacher.greeting.includes(teacher.honorific), `Lời chúc cần đúng xưng hô: ${teacher.name}`);
  assert.ok(teacher.greeting.length > 65, `Lời chúc quá ngắn: ${teacher.name}`);
  assert.equal(findTeachers(teacher.name)[0]?.id, teacher.id, `Tên phải dẫn đến đúng thiệp: ${teacher.name}`);
}

for (const query of ['Nguyễn Thành Long', 'Nguyen Thanh Long', '  nguyen   thanh   LONG ', 'Thanh Long', 'Nguyen Thanh Lng']) {
  assert.equal(findTeachers(query)[0]?.name, 'Nguyễn Thành Long', `Tìm kiếm sai: ${query}`);
}
assert.ok(findTeachers('Trần').length > 1, 'Tên chung phải có nhiều gợi ý');
assert.equal(findTeachers('Vinh Phuc')[0]?.name, 'Đào Vĩnh Phúc');
assert.equal(findTeachers('do thuy nhu')[0]?.name, 'Đỗ Thuỳ Như');
assert.equal(findTeachers('').length, 0, 'Không hiển thị tên khi ô nhập trống');
assert.equal(findTeacherMatches('Nguyễn Thành Long')[0]?.score, 0, 'Tên chính xác phải được ưu tiên');
assert.ok(findTeacherMatches('Nguyen Thanh Lng')[0]?.score >= 3, 'Tên gõ sai phải cần xác nhận');
assert.equal(findTeachers('Tên Không Có').length, 0, 'Tên không tồn tại không được gợi ý');
assert.equal(findTeachers('Ian Michael Biggar')[0]?.language, 'en');
assert.equal(findTeachers('Joseph Wallace Wisham III')[0]?.language, 'en');

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const file of ['css/style.css', 'css/animation.css', 'css/responsive.css', 'js/data.js', 'js/search.js', 'js/envelope.js', 'js/main.js']) {
  assert.ok(html.includes(file), `Thiếu liên kết ${file}`);
  assert.ok(fs.existsSync(path.join(root, file)), `Thiếu file ${file}`);
}
for (const file of ['assets/logo/fusion-club-transparent.png', 'assets/logo/btec.png']) {
  assert.ok(html.includes(file), `Thiếu logo trên trang: ${file}`);
  assert.ok(fs.existsSync(path.join(root, file)), `Thiếu file logo: ${file}`);
}
const header = html.match(/<header\b[^>]*>([\s\S]*?)<\/header>/)?.[1] || '';
assert.ok(header.includes('class="header-logos"'), 'Hai logo cần nằm cùng một cụm giữa header');
assert.ok(!header.includes('20 / 11'), 'Không hiển thị ngày 20/11 trong header');
assert.ok(!/(?:src|href)="\/(?!\/)/.test(html), 'Asset phải dùng đường dẫn tương đối');
assert.equal((html.match(/<section\b/g) || []).length, 3, 'Chỉ có ba màn hình chính');
assert.ok(html.includes('CLB Thiện Nguyện FUSION'), 'Tên CLB chính thức phải xuất hiện');
assert.ok(html.includes('role="combobox"') && html.includes('role="listbox"'), 'Autocomplete cần ARIA');
assert.ok(html.includes('<button id="envelope-stage"'), 'Phong bì phải là nút tương tác');
assert.ok(html.includes('<button id="home-button"') && html.includes('Quay về trang chủ'), 'Thiệp cần nút quay về trang chủ');
for (const removed of ['search-screen', 'open-envelope', 'reread-button', 'draft-note', 'FUSION CLUB']) {
  assert.ok(!html.includes(removed), `Giao diện còn thành phần cũ: ${removed}`);
}
assert.ok(!/localStorage|sessionStorage/.test(fs.readFileSync(path.join(root, 'js/main.js'), 'utf8')), 'Không lưu trạng thái sau reload');
assert.ok(fs.readFileSync(path.join(root, 'css/animation.css'), 'utf8').includes('prefers-reduced-motion'));

// Kiểm tra hai lần kích hoạt liên tiếp chỉ lên lịch mở thư một lần.
const handlers = {};
const scheduled = [];
const stageClasses = new Set();
const stage = {
  disabled: false,
  classList: {
    add(name) { stageClasses.add(name); },
    remove(name) { stageClasses.delete(name); }
  },
  addEventListener(type, callback) { handlers[type] = callback; }
};
const envelopeContext = vm.createContext({
  document: { getElementById() { return stage; } },
  window: {
    matchMedia() { return { matches: false }; },
    setTimeout(callback, delay) { scheduled.push({ callback, delay }); return scheduled.length; },
    clearTimeout() {}
  }
});
vm.runInContext(fs.readFileSync(path.join(root, 'js/envelope.js'), 'utf8'), envelopeContext);
let opened = 0;
const envelopeController = vm.runInContext('setupEnvelopeAnimation', envelopeContext)(() => { opened += 1; });
handlers.click();
handlers.click();
assert.equal(stage.disabled, true);
assert.equal(scheduled.length, 1, 'Nhấn hai lần không được mở hai lần');
assert.ok(scheduled[0].delay >= 2000 && scheduled[0].delay <= 3000);
scheduled[0].callback();
assert.equal(opened, 1);
envelopeController.reset();
assert.equal(stage.disabled, false, 'Về trang chủ phải cho phép mở lại phong bì');
assert.equal(stageClasses.has('is-opening'), false, 'Hoạt ảnh cũ phải được xóa');
handlers.click();
assert.equal(scheduled.length, 2, 'Phong bì phải mở được ở lượt xem tiếp theo');

// Mô phỏng các sự kiện của combobox để kiểm tra Enter, phím mũi tên và Escape.
class StubElement {
  constructor() { this.children = []; this.handlers = {}; this.attributes = {}; this.hidden = false; this.value = ''; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  removeAttribute(name) { delete this.attributes[name]; }
  addEventListener(type, callback) { this.handlers[type] = callback; }
  replaceChildren() { this.children = []; }
  append(...children) { this.children.push(...children); }
  querySelectorAll() { return this.children.filter((child) => child.attributes.role === 'option'); }
  scrollIntoView() {}
  fire(type, key) {
    this.handlers[type]({ key, preventDefault() {} });
  }
}
const elements = Object.fromEntries(['welcome-form', 'welcome-name', 'search-results', 'search-status'].map((id) => [id, new StubElement()]));
const uiContext = vm.createContext({
  document: {
    getElementById(id) { return elements[id]; },
    createElement() { return new StubElement(); }
  }
});
for (const file of ['js/data.js', 'js/search.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), uiContext);
}
const chosen = [];
vm.runInContext('setupTeacherSearch', uiContext)((teacher) => chosen.push(teacher.name));
const input = elements['welcome-name'];
const list = elements['search-results'];
input.value = 'Nguyen Thanh Long';
input.fire('input');
assert.equal(list.hidden, false);
assert.equal(input.attributes['aria-expanded'], 'true');
input.fire('keydown', 'Enter');
assert.equal(chosen.at(-1), 'Nguyễn Thành Long', 'Enter với tên chính xác phải mở đúng thư');
input.value = 'Nguyen Thanh Lng';
input.fire('input');
const beforeFuzzy = chosen.length;
input.fire('keydown', 'Enter');
assert.equal(chosen.length, beforeFuzzy, 'Tên gần đúng không tự mở bằng Enter');
input.fire('keydown', 'ArrowDown');
assert.equal(input.attributes['aria-activedescendant'], 'teacher-option-0');
input.fire('keydown', 'Enter');
assert.equal(chosen.at(-1), 'Nguyễn Thành Long', 'ArrowDown + Enter xác nhận gợi ý');
input.value = 'Trần';
input.fire('input');
assert.ok(list.children.length > 1);
input.fire('keydown', 'Escape');
assert.equal(list.hidden, true);
assert.equal(input.attributes['aria-expanded'], 'false');
input.value = 'Tên Không Có';
input.fire('input');
assert.equal(elements['search-status'].textContent, 'Chưa tìm thấy tên phù hợp. Thầy/Cô vui lòng kiểm tra lại nhé!');
console.log('Đạt: 24 thiệp giữ nguyên, ba màn hình, autocomplete và đường dẫn GitHub Pages.');
