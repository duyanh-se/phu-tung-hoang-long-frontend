# MOTION-001 — Kế hoạch nâng cấp animation theo tham khảo VIKBLE

**Trạng thái:** người dùng đã xác nhận triển khai ngày 2026-09-15; hoàn tất theo MOTION-002. Các bảng dưới đây lưu phạm vi đã duyệt và kết quả thực hiện.

## 1. Mục tiêu và phạm vi

Nâng cấp landing page `/` để chuyển động mượt, có nhiều lớp và mỗi chương có một nhịp riêng. Giữ nguyên nội dung, dữ liệu API, palette đỏ–trắng–than, font Be Vietnam Pro và cấu trúc sáu chương đã duyệt trong HOME-001/HOME-002.

Nguồn tham khảo: [vikble.com](https://vikble.com/), được mở và kiểm tra trực tiếp trên desktop 1440×900 và mobile 390×844 ngày 2026-09-15. Chỉ tham khảo kỹ thuật kể chuyện bằng chuyển động; không sao chép màu, font, hình ảnh, nội dung, bố cục thương hiệu hoặc widget liên hệ của VIKBLE.

## 2. Điều quan sát được từ trang tham khảo

- Hero dùng media toàn màn hình, chữ lớn theo từng dòng và nhiều lớp foreground/background.
- Các cảnh dài dùng `position: sticky`; tiêu đề, card và media thay đổi theo tiến độ cuộn thay vì chỉ xuất hiện một lần.
- Có các đoạn chuyển cảnh mạnh: chữ đổi vị trí/opacity, logo phóng lớn, nội dung sau đi lên phủ cảnh trước.
- Card xuất hiện theo thứ tự và có khoảng trễ; các nhóm lợi ích dịch theo trục Y trong khi section giữ nguyên.
- Mobile giữ câu chuyện dọc và giảm độ phức tạp của bố cục, nhưng vẫn duy trì một chuyển động chính cho từng cảnh.
- Phép đo runtime cho thấy một thao tác wheel chuyển `scrollY` ngay đến vị trí đích; cảm giác mượt chủ yếu đến từ transform/opacity bám tiến độ và sticky, không phải cơ chế thay thế cuộn gốc. Đây là suy luận từ hành vi quan sát, không phải tuyên bố về source nội bộ của trang.

## 3. Nguyên tắc áp dụng cho Hoàng Long

1. Giữ cuộn gốc của trình duyệt; không thêm Lenis, không chặn wheel/touch và không snap section.
2. Dùng numeric `scrub` của GSAP để animation bắt kịp vị trí cuộn trong 0.5–0.9 giây, tạo độ êm mà không làm thay đổi cách người dùng cuộn.
3. Mỗi section có một hiệu ứng chính; hiệu ứng phụ chỉ hỗ trợ phân cấp nội dung.
4. Ưu tiên `transform` và `opacity`; clip-path chỉ dùng cho ba ảnh gallery. Không chạy animation vô hạn.
5. Nội dung HTML luôn hiển thị trước khi JavaScript chạy. `prefers-reduced-motion: reduce` hiển thị trạng thái cuối, bỏ sticky do animation, parallax, scrub và smooth anchor.
6. Không thêm video hoặc ảnh dựng vì hiện chỉ có ảnh cửa hàng và chưa có ảnh sản phẩm DENIS.

## 4. Route và component

| Route/màn   | Hành động        | Thành phần chính                                                                                                          | Responsive và trạng thái                                                                                       |
| ----------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `/`         | Sửa              | SiteHeader, LandingHero, StoreStory, DenisSpotlight, FeaturedDenisProducts, StoreGallery, ContactSection, SectionProgress | Desktop có sticky/scrub nhiều lớp; tablet/mobile giữ flow dọc và reveal ngắn; reduced motion/no-JS tĩnh đầy đủ |
| `/san-pham` | Không đổi bố cục | ProductCard dùng chung nhận micro-interaction mới                                                                         | Hover chỉ trên thiết bị hỗ trợ hover; focus-visible có phản hồi tương đương; loading/error/empty giữ chức năng |

| Component/hook                         | Tạo/sửa                    | Trách nhiệm                                                                                            | Vị trí                                                  |
| -------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| `MotionText`                           | Tạo mới                    | Chia dòng/từ thành span có mask, giữ accessible name, dùng lại cho hero/heading/CTA                    | `src/components/motion/motion-text.tsx`                 |
| `SectionProgress`                      | Tạo mới                    | Rail 6 chương trên desktop, cập nhật mục hiện tại bằng IntersectionObserver, link anchor bàn phím được | `src/components/features/landing/section-progress.tsx`  |
| `ProductSkeleton`                      | Tạo mới                    | Ba card placeholder giữ chiều cao ổn định khi tải; sheen một lượt                                      | `src/components/features/products/product-skeleton.tsx` |
| `SiteHeader`                           | Sửa                        | Sticky, thu gọn nhẹ khi rời hero, active section/route                                                 | file hiện có                                            |
| `LandingHero`                          | Sửa                        | Mask reveal chữ, nhiều lớp parallax và exit transition                                                 | file hiện có                                            |
| `useScrollStory`, `StoreStory`         | Sửa                        | Làm êm crossfade, thêm progress chương và chuyển ảnh có chiều sâu                                      | file hiện có                                            |
| `DenisSpotlight`                       | Sửa                        | Tạo cảnh chuyển DENIS sticky ngắn và reveal ba dòng sản phẩm                                           | file hiện có                                            |
| `ScrollReveal`                         | Sửa                        | Thêm direction/distance cho các nhóm nhưng vẫn dùng preset tập trung                                   | file hiện có                                            |
| `FeaturedDenisProducts`, `ProductCard` | Sửa                        | Stagger xen kẽ, hover/focus lift, đường nhấn chạy                                                      | file hiện có                                            |
| `StoreGallery`                         | Sửa thành client component | Mask reveal và parallax ảnh                                                                            | file hiện có                                            |
| `ContactSection`, `ActionLink`         | Sửa                        | Word reveal, nền chéo dịch nhẹ và arrow phản hồi hover/focus                                           | file hiện có                                            |
| `motion.ts`, `landing.css`             | Sửa                        | Preset scrub/micro/emphasis và style dùng lại                                                          | file hiện có                                            |

`page.tsx` và `LandingScreen` vẫn chỉ ghép component; không đưa timeline dài vào page.

## 5. Animation đề xuất cụ thể

| Màn/component           | Trigger                         | Hiệu ứng                                                                                                       | Nhịp dự kiến                           | Mobile                                     | Reduced motion             |
| ----------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------ | -------------------------- |
| SiteHeader              | Rời 25% hero                    | Header sticky thu chiều cao khoảng 80→64 px, nền surface 86%, blur nhẹ; active nav đổi màu                     | 220 ms `power2.out`                    | Giữ chiều cao hiện tại, chỉ đổi nền        | Tĩnh, không tween          |
| Hero entrance           | Trang sẵn sàng                  | Eyebrow, từng dòng heading và CTA mở qua mask; ảnh scale 1.06→1                                                | 750–900 ms, stagger 80 ms `power3.out` | Dịch 12 px, 550 ms                         | Hiện ngay                  |
| Hero exit               | Cuộn hết hero                   | Ảnh y -64 px/scale 1.06→1, lớp tối tăng nhẹ; hai dòng heading lệch ngang ±24 px và opacity về 0.35             | scrub 0.8 s                            | Chỉ ảnh y -20 px, không lệch chữ           | Tĩnh                       |
| StoreStory              | Mỗi chapter qua 65→35% viewport | Ảnh cũ scale 1→1.06 rồi mờ; ảnh mới clip mềm + scale 1.08→1; số chapter chạy 01→02→03 và thanh tiến độ đầy dần | scrub 0.6 s                            | Ảnh/chữ reveal y 16 px, không sticky       | Xếp dọc tĩnh               |
| DENIS bridge            | Vào section                     | Chữ `DENIS.` ở giữa scale 0.76→1.12, nền chéo đi ngược 32 px; nội dung chính đi lên phủ cảnh mở                | sticky khoảng 130vh, scrub 0.75 s      | Reveal heading + nền dịch 16 px, không pin | Nội dung cuối hiện ngay    |
| Dòng sản phẩm DENIS     | Qua từng hàng                   | Số và tên vào từ hai phía 20 px; rule scaleX 0→1                                                               | 600 ms, stagger 90 ms                  | Tất cả vào từ Y 12 px                      | Hiện ngay                  |
| Product cards           | Grid vào viewport               | Card xen kẽ y 40 px, rotate ±1.25°→0; chạy một lần                                                             | 650 ms, stagger 90 ms                  | y 16 px, không rotate                      | Hiện ngay                  |
| ProductCard hover/focus | Pointer/focus                   | Card nâng 6 px; viền nhấn mở trái→phải; ảnh scale 1.03 nếu có; arrow/code dịch 3 px                            | 240 ms `power2.out`                    | Chỉ active color; không lift trên touch    | Không tween                |
| Product loading         | Request đang tải                | Ba skeleton card; sheen đi qua đúng một lần, không loop                                                        | 900 ms                                 | Như desktop                                | Placeholder tĩnh           |
| Gallery                 | Mỗi ảnh đi qua 85→30% viewport  | Khung mở bằng `clip-path: inset(10% 0)`; ảnh y 8%→-4%; caption reveal trễ                                      | scrub 0.85 s, caption 500 ms           | Chỉ mask + caption, bỏ parallax            | Ảnh hoàn chỉnh             |
| Closing CTA             | Vào viewport                    | Từng cụm từ mở qua mask; hai dải chéo nền dịch 36 px; nút lên 16 px                                            | 700 ms, stagger 80 ms                  | Dải nền dịch 12 px                         | Hiện ngay                  |
| SectionProgress         | Section active                  | Dot hiện tại scale 1→1.5 và kéo thành pill ngắn; tooltip khi focus/hover                                       | 220 ms                                 | Ẩn dưới 1024 px                            | Trạng thái active đổi ngay |
| Anchor                  | Click điều hướng                | Smooth scroll gốc như hiện tại                                                                                 | Trình duyệt                            | Như desktop                                | Cuộn ngay                  |

## 6. Theme và token

- Không đổi palette, font, cỡ chữ hoặc font weight đã duyệt.
- Giữ typography `display` 44–96 px. `MotionText` chỉ bọc span, không tạo preset chữ mới.
- Bổ sung preset tập trung trong `src/styles/motion.ts`: `micro 0.22`, `enter 0.7`, `emphasis 0.9`, `scrub.hero 0.8`, `scrub.story 0.6`, `scrub.gallery 0.85`, `rotate.card 1.25`.
- Bổ sung một giá trị surface trong suốt dùng cho header bằng `color-mix()` từ token `surface`; không thêm màu thương hiệu mới.
- Không áp dụng `will-change` cho layout toàn trang; chỉ ba panel ảnh story dùng hint này vì chúng đồng thời scale, opacity và clip-path.

## 7. Dữ liệu và state

- Không thay API, DTO, service, hook data hoặc Zustand `productView`.
- `SectionProgress` dùng state cục bộ/IntersectionObserver vì chỉ phục vụ viewport hiện tại; không đưa tiến độ cuộn vào Zustand.
- `ProductSkeleton` chỉ phản ánh `isLoading`; error, empty, retry và bảo vệ request cũ giữ nguyên.
- Không tạo nội dung DENIS, số liệu cửa hàng hoặc thông tin liên hệ mới.

## 8. Tiêu chí kiểm chứng

- Lint, TypeScript, unit/hook tests, production build và Prettier.
- Playwright ở 360×800, 768×1024, 1440×900, 1440×600; kiểm tra không overflow ngang và không có page error.
- Kiểm tra timeline tại đầu/giữa/cuối mỗi section; numeric scrub phải bắt kịp sau tối đa khoảng 0.9 giây khi dừng cuộn.
- Resize qua breakpoint phải cleanup pin/timeline cũ. Quay lại route không nhân đôi ScrollTrigger.
- Reduced motion và JavaScript disabled: toàn bộ nội dung/ảnh/nút nhìn thấy, thứ tự đọc đúng, không còn transform/opacity ẩn.
- Keyboard: rail, nav và CTA focus được; hover không chứa thông tin bắt buộc.
- Theo dõi layout shift, số ScrollTrigger sau route/resize và ảnh ưu tiên; không thêm autoplay media hoặc vòng animation nền.

## 9. Cần xác nhận

Đã triển khai toàn bộ bảng mục 5. Bridge DENIS dùng section cao 230svh để tạo khoảng cuộn 130svh thực tế khi phần pin cao một viewport; đây là cách CSS sticky có thể duy trì cảnh trong khoảng đã duyệt. Kết quả kiểm chứng ở MOTION-002 trong CHANGELOG.md.
