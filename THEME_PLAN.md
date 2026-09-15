# THEME-001 — Theme từ logo Hoàng Long

**Trạng thái:** người dùng đã duyệt toàn bộ phương án bằng phản hồi "tôi đồng ý" ngày 2026-09-15. Đã triển khai theme, component và animation theo kế hoạch; kết quả kiểm chứng ghi tại THEME-002 trong CHANGELOG.md.

## 1. Cơ sở và định hướng

- Nguồn: [Logo_Hoang_Long.jpg](public/images/shop/logo/Logo_Hoang_Long.jpg), ảnh JPEG 1280 × 1280; đã xem trực tiếp.
- Người dùng mô tả PNG; file thực tế hiện có là JPEG và vẫn dùng được. Giữ nguyên tài nguyên gốc.
- Biểu tượng trắng, nét chéo và hình học rõ; chữ thương hiệu đậm/nghiêng trên nền đỏ.
- Lấy mẫu điểm ảnh cách 5 pixel theo mỗi trục: màu phổ biến nhất #C90A00. Đây là màu đo từ ảnh được cung cấp, không phải mã màu thương hiệu đã được xác nhận.
- Đề xuất: giao diện sáng, gọn, chắc, dễ đọc tên/mã phụ tùng; đỏ cho nhận diện và hành động chính; nền trung tính giúp nội dung dễ quét.
- Hình thức chữ nghiêng của logo được giữ trong ảnh; chữ giao diện dùng font thẳng để đọc thông tin dài.
- Chưa có wireframe hoặc ảnh giới thiệu; nhiệm vụ này thiết lập theme và áp dụng cho màn danh mục hiện có.

## 2. Bảng màu đề xuất

| Vai trò/token | Giá trị | Cách dùng                      |
| ------------- | ------- | ------------------------------ |
| brand-50      | #FFF1F0 | Nền nhấn rất nhẹ               |
| brand-100     | #FFE0DC | Nền trạng thái chọn            |
| brand-500     | #E2231A | Điểm nhấn trang trí            |
| brand-600     | #C90A00 | Màu chính, nút chính, liên kết |
| brand-700     | #A60800 | Hover/active                   |
| background    | #FAFAF9 | Nền toàn trang                 |
| surface       | #FFFFFF | Header, card, input            |
| foreground    | #18181B | Nội dung chính                 |
| muted         | #52525B | Mô tả và nội dung phụ          |
| border        | #D4D4D8 | Viền card và đường phân chia   |
| input-border  | #71717A | Viền nhận diện input           |
| danger        | #B91C1C | Lỗi, luôn kèm thông báo chữ    |
| success       | #166534 | Thành công                     |
| warning       | #A16207 | Cảnh báo                       |
| info          | #1D4ED8 | Thông tin                      |

Nút chính dùng chữ trắng trên brand-600; thông báo lỗi phân biệt bằng nội dung và cấu trúc, không dựa riêng vào đỏ.

Đã tính tỉ lệ tương phản từ các mã màu đề xuất: trắng/brand-600 = 5.95:1; foreground/background = 16.96:1; muted/trắng = 7.73:1; input-border/trắng = 4.83:1. Đây là kiểm tra cặp màu, chưa phải kiểm chứng toàn bộ giao diện.

## 3. Font và hệ chữ

**Đề xuất một font chính:** Be Vietnam Pro cho cả heading và nội dung, fallback Arial/sans-serif. Font có bộ ký tự tiếng Việt và các weight 300–700 theo [metadata Google Fonts](https://raw.githubusercontent.com/google/fonts/main/ofl/bevietnampro/METADATA.pb).

Sau khi được duyệt, lưu font trong project, dùng next/font/local và kèm [giấy phép OFL](https://raw.githubusercontent.com/google/fonts/main/ofl/bevietnampro/OFL.txt). Không nhận định font trong logo là Be Vietnam Pro.

| Preset        | Mobile → desktop | Line-height | Weight | Mục đích                    |
| ------------- | ---------------- | ----------- | ------ | --------------------------- |
| title         | 32 → 40 px       | 1.2         | 700    | Tiêu đề trang               |
| section-title | 24 → 28 px       | 1.3         | 600    | Tiêu đề vùng nội dung       |
| subtitle      | 18 → 20 px       | 1.4         | 600    | Nội dung dẫn/tiêu đề phụ    |
| card-title    | 18 px            | 1.4         | 600    | Tên sản phẩm                |
| paragraph     | 16 px            | 1.65        | 400    | Nội dung chính              |
| label         | 14 px            | 1.5         | 500    | Nhãn form, điều hướng       |
| button        | 14 px            | 1.5         | 600    | Nhãn nút                    |
| caption       | 12 px            | 1.5         | 400    | Chú thích                   |
| eyebrow       | 12 px            | 1.5         | 600    | Nhãn ngắn phía trên tiêu đề |

Trong code dùng rem và clamp cho preset thay đổi theo viewport. Giá trị px trong bảng là mốc quy đổi ở font gốc 16 px. Input dùng 16 px. Mã sản phẩm vẫn dùng font chính, số/giá có thể dùng tabular-nums.

Giữ bộ weight dùng chung: light 300, normal 400, medium 500, semibold 600, bold 700. Light chỉ dành cho đoạn giới thiệu lớn khi cần; nội dung đọc và thông tin sản phẩm mặc định 400 trở lên.

## 4. Style chung

- Spacing theo nhịp 4 px; dùng các mức 4, 8, 12, 16, 24, 32, 48, 64 từ hệ token chung.
- Button và input cao tối thiểu 44 px, bo góc 8 px.
- Card bo góc 12 px, viền 1 px; padding 20 px trên mobile, 24 px trên desktop.
- Shadow dùng một preset nhẹ: 0 2px 8px rgb(24 24 27 / 6%).
- Khung nội dung tối đa 1152 px, padding ngang 20 px mobile/32 px desktop.
- Nút chính nền đỏ/chữ trắng; nút phụ nền trắng/viền; ghost dùng cho thao tác thứ cấp.
- Focus dùng outline đỏ 2 px, offset 2 px. Disabled giảm độ nổi bật và chặn thao tác.
- Loading/empty/error vẫn có nội dung chữ rõ ràng; thành phần thao tác giữ label và điều hướng bàn phím.
- Logo dùng ảnh gốc trong component chung, giữ tỉ lệ và nền đỏ, không tự xóa nền/cắt/vẽ lại logo.

## 5. Màn hình và component trong kế hoạch

| Màn/route  | Thao tác       | Phạm vi                                          | Responsive/trạng thái                                                                                    |
| ---------- | -------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Danh mục / | Cập nhật theme | Logo, typography, màu và style component hiện có | Lưới 1/2/3 cột theo không gian; toolbar xuống hàng; loading, empty, error/thử lại, kết quả và phân trang |

Không thêm route hoặc màn nghiệp vụ trong kế hoạch này.

| Component                              | Tạo mới/sửa/dùng lại        | Trách nhiệm/vị trí                                                     |
| -------------------------------------- | --------------------------- | ---------------------------------------------------------------------- |
| BrandLogo                              | Tạo mới                     | Hiển thị logo dùng lại ở src/components/ui/brand-logo.tsx              |
| Typography, Title, Subtitle, Paragraph | Sửa                         | Thêm preset và đồng bộ hệ chữ tại src/components/ui/typography.tsx     |
| Button                                 | Sửa                         | Áp dụng màu, kích thước, trạng thái và motion đã duyệt                 |
| Input                                  | Sửa                         | Đồng bộ font/viền/focus                                                |
| Card                                   | Sửa                         | Đồng bộ radius, padding, shadow                                        |
| Pagination                             | Sửa                         | Dùng preset chữ và Button chung                                        |
| LoadingState, EmptyState               | Dùng lại, đồng bộ qua theme | Giữ nội dung trạng thái trong src/components/ui/feedback.tsx           |
| Container                              | Dùng lại                    | Giữ khung responsive chung                                             |
| SiteHeader, SiteFooter                 | Sửa                         | Dùng BrandLogo và typography chung trong src/components/layout/        |
| HomeScreen                             | Sửa                         | Dùng title/eyebrow và spacing đã chốt                                  |
| ProductToolbar, ProductCard            | Sửa                         | Dùng label/card-title và loại bỏ style chữ/màu riêng                   |
| ProductCatalog                         | Dùng lại                    | Tiếp nhận theme chung, giữ tìm kiếm/phân trang và chuyển kiểu hiển thị |

Các component sửa nằm tại thư mục hiện có theo PROJECT.md. Tài nguyên font đặt trong src/assets/fonts/be-vietnam-pro/ kèm giấy phép. Tokens tập trung tại src/styles/tokens.css; preset tại src/styles/typography.ts; kết nối font ở src/app/layout.tsx.

## 6. Animation đề xuất để xác nhận

| Phạm vi                                                      | Đề xuất                                                    | Trigger                             | Duration/easing | Reduced motion   |
| ------------------------------------------------------------ | ---------------------------------------------------------- | ----------------------------------- | --------------- | ---------------- |
| Button, Input, liên kết header/footer, điều khiển phân trang | Chuyển màu nền/chữ/viền nhẹ                                | Hover hoặc đổi trạng thái tương tác | 150 ms ease-out | Tắt transition   |
| Focus outline                                                | Hiển thị ngay để thấy vị trí bàn phím                      | Focus-visible                       | 0 ms            | Giữ ngay lập tức |
| Trang, logo, card, loading/empty/error                       | Không animation xuất hiện/di chuyển, không shimmer/spinner | Render hoặc cập nhật dữ liệu        | 0 ms            | Không đổi        |

Duration/easing đã được xác nhận và định nghĩa một lần trong tokens. Khi prefers-reduced-motion: reduce, duration trở về 0 ms.

## 7. Dữ liệu và kiểm chứng

Phần thay đổi tập trung vào giao diện dùng chung. Tái sử dụng productService, useProducts, Axios config và Zustand productView. Không có yêu cầu mới về API, DTO hoặc nghiệp vụ.

Sau khi kế hoạch được duyệt:

1. Cài font local, cập nhật token và component theo danh sách.
2. Kiểm tra toàn bộ chữ/màu/weight trong các component bị ảnh hưởng cùng nguồn token.
3. Chạy lint, typecheck, tests hiện có, production build và kiểm tra định dạng.
4. Kiểm tra giao diện tại 360, 768 và 1440 px, focus bàn phím, logo, dấu tiếng Việt và các trạng thái dữ liệu nếu có trình duyệt kết nối.
5. Kiểm tra transition và prefers-reduced-motion; phân biệt test mock với backend thật.
6. Cập nhật PROJECT.md, CHANGELOG.md; ghi rõ giới hạn nếu backend/trình duyệt chưa sẵn sàng.

## 8. Phạm vi đã xác nhận

- Palette đỏ–trắng–than và style trong mục 2/4.
- Be Vietnam Pro và hệ chữ mục 3.
- Màn/component sẽ cập nhật hoặc tạo mới trong mục 5.
- Transition màu 150 ms và các lựa chọn không animation trong mục 6.

Nguồn xác nhận: người dùng trả lời "tôi đồng ý" sau khi được trình palette, font, danh sách component và animation 150 ms ngày 2026-09-15. Các phần trên giữ lại mô tả phương án làm căn cứ triển khai; không còn mục chờ duyệt trong phạm vi này.
