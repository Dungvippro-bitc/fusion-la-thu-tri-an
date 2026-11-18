# Lá Thư Tri Ân — CLB Thiện Nguyện FUSION

Website tĩnh tri ân ngày Nhà giáo Việt Nam 20/11. Dự án dùng HTML5, CSS3, Bootstrap 5 và JavaScript thuần; không cần backend, tài khoản hay API key.

## Cấu trúc

```text
fusion-teachers-day/
├── index.html                 # Ba màn hình trên một trang: nhập tên, phong bì, thiệp
├── css/
│   ├── style.css              # Bố cục, màu sắc, thiệp và phong bì
│   ├── animation.css          # Chuyển động và reduced motion
│   └── responsive.css         # Điều chỉnh theo kích thước màn hình
├── js/
│   ├── data.js                # 24 người nhận và 24 lời chúc riêng
│   ├── search.js              # Autocomplete ngay trên trang chủ
│   ├── envelope.js            # Điều khiển hoạt ảnh khi nhấn phong bì
│   └── main.js                # Ba trạng thái và hiển thị thiệp
└── assets/
    ├── images/                # Hoa trang trí và nền giấy SVG
    └── logo/                  # Logo FUSION gốc, bản trong suốt và logo BTEC
```

## Chạy tại máy

Mở `index.html` trực tiếp trong trình duyệt, hoặc chạy một máy chủ tĩnh tại thư mục dự án, ví dụ `npx serve .` nếu đã có Node.js. Bootstrap và Google Fonts được tải từ CDN; khi không có mạng, giao diện vẫn dùng CSS cục bộ và font dự phòng.

## Kiểm tra nội dung trước khi công bố

**Toàn bộ 24 lời chúc trong `js/data.js` vẫn là bản nháp.** CLB Thiện Nguyện FUSION cần duyệt tên, cách xưng hô và từng lời chúc trước khi chia sẻ website. Mỗi đối tượng dữ liệu chỉ có một thiệp; hai người nhận `language: "en"` có nội dung bằng tiếng Anh. Dữ liệu lời chúc được giữ nguyên trong lần nâng cấp giao diện này. Để sửa lời chúc sau khi duyệt, chỉnh đúng thuộc tính `greeting` của người đó, không cần sửa HTML.

## Kiểm tra nhanh

1. Chạy `node tests/verify.cjs` để kiểm tra dữ liệu và tìm kiếm.
2. Ngay ở trang chủ, tìm `Nguyễn Thành Long`, `Nguyen Thanh Long`, `Thanh Long` và `Nguyen Thanh Lng`; chọn đúng gợi ý hoặc nhấn Enter với tên khớp rõ ràng, rồi chạm vào phong bì.
3. Tìm `Trần` để kiểm tra nhiều kết quả và `Tên Không Có` để kiểm tra thông báo không tìm thấy.
4. Mở thiệp của Ian Michael Biggar và Joseph Wallace Wisham III để kiểm tra tiếng Anh.
5. Kiểm tra bàn phím tại ô nhập tên: `ArrowDown`/`ArrowUp` chuyển gợi ý, Enter chọn, Escape đóng danh sách. Phong bì là một nút nên có thể mở bằng Enter hoặc Space.
6. Kiểm tra ở màn hình điện thoại và với cài đặt giảm chuyển động (`prefers-reduced-motion`). Sau khi đọc thiệp, nhấn **Quay về trang chủ** và tìm một người khác để kiểm tra phong bì có thể mở lại.

## Đưa lên GitHub Pages

Tên hiển thị trên tab trình duyệt và khi chia sẻ link là **Lá Thư Tri Ân | CLB Thiện Nguyện FUSION**. Tên repository gợi ý là `la-thu-tri-an-20-11`, để URL có dạng `https://USERNAME.github.io/la-thu-tri-an-20-11/`. Địa chỉ `USERNAME.github.io` phụ thuộc vào tên tài khoản GitHub; muốn dùng một tên miền khác hoàn toàn cần sở hữu và cấu hình tên miền riêng.

1. Tạo repository mới trên GitHub tên `la-thu-tri-an-20-11`, chọn **Public** nếu dùng GitHub Free, và **để trống** (không chọn tạo sẵn README, `.gitignore` hoặc license). Từ thư mục `fusion-teachers-day`, chạy:

   ```powershell
   git add -A
   git commit -m "Update Lá Thư Tri Ân website"
   git remote add origin https://github.com/USERNAME/la-thu-tri-an-20-11.git
   git push -u origin main
   ```

   Thay `USERNAME` bằng tên tài khoản GitHub của bạn. `index.html` đã nằm ở gốc repository cục bộ. Xem [hướng dẫn GitHub về đẩy repository có sẵn](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github).
2. Trong GitHub, mở **Settings → Pages → Build and deployment**; chọn **Deploy from a branch**, nhánh `main`, thư mục `/ (root)`, rồi lưu. Xem [hướng dẫn chính thức của GitHub](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
3. Đợi GitHub Pages công bố địa chỉ `https://USERNAME.github.io/la-thu-tri-an-20-11/` và mở thử. Toàn bộ đường dẫn asset trong trang là đường dẫn tương đối nên hoạt động dưới subpath này.
4. Sau khi duyệt nội dung và kiểm tra đường dẫn, có thể dùng URL đó để tạo mã QR.

Repository Git cục bộ đã được khởi tạo ở nhánh `main`. Mã nguồn chưa được đẩy lên GitHub hoặc triển khai Pages; chỉ thực hiện các bước trên sau khi CLB Thiện Nguyện FUSION duyệt nội dung.
