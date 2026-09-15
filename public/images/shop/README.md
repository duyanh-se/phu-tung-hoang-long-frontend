# Hình ảnh shop Phụ Tùng Hoàng Long

Đặt tài nguyên của shop vào các thư mục bên dưới:

```text
public/images/shop/
  logo/              # Logo chính và các phiên bản logo nếu có
  introduction/      # Ảnh mặt tiền, bên trong cửa hàng, kho, đội ngũ...
  denis/             # Ảnh sản phẩm DENIS, ưu tiên đặt tên theo mã hàng
```

## Logo

- Ưu tiên SVG hoặc PNG nền trong suốt; có thể cung cấp JPG/WebP nếu đó là bản hiện có.
- Giữ màu và tỉ lệ logo gốc. Nếu có nhiều phiên bản, chỉ rõ bản chính bằng tên như logo-primary.svg.
- Có thể đặt thêm bản nền sáng/tối hoặc logo ngang/dọc, đặt tên phân biệt.
- Nếu có tên font hoặc hướng dẫn nhận diện thương hiệu sẵn, báo kèm khi cung cấp logo.

## Ảnh giới thiệu

- Đặt tên mô tả, không dấu, dùng dấu gạch nối: mat-tien-shop.jpg, khong-gian-cua-hang.jpg, kho-phu-tung.jpg.
- Cung cấp ảnh rõ nét, giữ bản gốc; việc chọn/cắt ảnh sẽ dựa trên bố cục được duyệt.
- Không cần đổi ảnh sang một kích thước cố định khi chưa có thiết kế.

File tại đây có thể được website sử dụng bằng URL /images/shop/..., ví dụ /images/shop/logo/logo-primary.svg.

## Thiết kế theme sau khi nhận logo

**Trạng thái:** đã nhận Logo_Hoang_Long.jpg (JPEG 1280 × 1280). Người dùng đã duyệt [THEME_PLAN.md](../../../THEME_PLAN.md) ngày 2026-09-15. Theme đỏ–trắng–than, Be Vietnam Pro và transition màu 150 ms đã được áp dụng; BrandLogo hiển thị ảnh gốc trong header/footer.

Phạm vi đã thực hiện theo xác nhận:

1. Phân tích màu và đặc điểm nhận diện từ logo.
2. Đề xuất bảng màu: brand, nền, bề mặt, chữ, viền và trạng thái.
3. Chọn font hỗ trợ tiếng Việt; định nghĩa cỡ chữ, line-height và weight cho title, subtitle, paragraph, caption, label và button.
4. Định nghĩa style chung: khoảng cách, bo góc, viền, shadow và trạng thái tương tác.
5. Cập nhật nguồn theme tập trung ở src/styles/tokens.css và src/styles/typography.ts.
6. Áp dụng nhất quán cho component hiện có: Typography/Title/Subtitle/Paragraph, Button, Input, Card, Pagination, SiteHeader, SiteFooter và các thành phần màn danh mục tại route /.
7. Dùng transition màu 150 ms ease-out cho điều khiển/liên kết, tắt khi reduced motion; trang/card/logo không animation.

Đã nhận ảnh `cua-hang-1.jpg` đến `cua-hang-6.jpg` và `logo-cua-hang.jpg`. Landing HOME-002 dùng ảnh mặt tiền thật, quầy và các kệ hàng; cấu hình tại `src/config/landing.ts`. Theme hiện có thêm display 44–96 px và animation storytelling theo HOME-001 đã duyệt. Danh mục đã chuyển sang `/san-pham`.

## Ảnh DENIS

Thư mục `denis/` hiện chờ ảnh sản phẩm. Đặt tên theo mã hàng và cung cấp ánh xạ mã–ảnh để nối vào backend `imageUrl` hoặc config sau này. Việc chép ảnh vào thư mục chưa tự cập nhật card. Không dùng ảnh kệ có hãng khác làm ảnh sản phẩm DENIS. Card hiện dùng dữ liệu chữ khi `imageUrl` rỗng và có fallback nếu ảnh lỗi.
