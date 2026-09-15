# Thông tin dự án — Phụ Tùng Hoàng Long Frontend

## Mục đích và phạm vi

Project `phu-tung-hoang-long-frontend` là frontend cho Phụ Tùng Hoàng Long, kết nối API backend cùng tên. Home là landing page storytelling giới thiệu cửa hàng và DENIS; danh mục sản phẩm nằm tại `/san-pham`.

Chưa có yêu cầu đầy đủ cho toàn bộ website hoặc bộ wireframe được duyệt. Không suy luận thêm màn hình, nghiệp vụ mua hàng, giỏ hàng, thanh toán hay quản trị từ tên dự án.

### Chuyển cảnh section xếp lớp đã duyệt và triển khai

- Cơ chế `STACK-001` giữ Hero, sản phẩm DENIS và gallery tại chỗ trên desktop đủ lớn; section sau trượt từ dưới lên để phủ cảnh đang xem. Store Story và DENIS giữ hiệu ứng cuộn nội bộ của chúng.
- `StoryStage` ghim trọn phần kể chuyện Store Story trên desktop: chữ bên trái và khung ảnh bên phải cùng giữ tại tâm chiều dọc trong suốt ba chapter. Khi đổi chapter, chữ cũ rời tâm 160 px lên trên còn chữ mới đi từ 160 px bên dưới vào tâm, tạo khoảng trống rõ ràng giữa hai khối; ba ảnh vẫn crossfade tại cùng một vị trí. Không thay palette, font hay type scale.
- Mobile, viewport thấp và Reduced Motion dùng luồng cuộn bình thường. Chi tiết: [STACKING_PLAN.md](STACKING_PLAN.md).
- Products DENIS dùng `brand-50`, gallery dùng `background`; các nền liền kề khác nhau rõ ràng khi scene chồng lên nhau mà không thêm token màu mới.
- Header chỉ được ScrollTrigger ghim trong Hero desktop; Store Story phủ lên khi chạm đỉnh. Các route khác vẫn dùng header sticky; mobile và Reduced Motion dùng header theo document flow.
- Trong bridge DENIS desktop, panel giới thiệu dòng dầu bắt đầu bên dưới viewport rồi trượt lên phủ kín stage và thay thế chữ `DENIS.`; tiêu đề lớn mờ hết khi panel chạm vị trí. Mobile, viewport thấp, Reduced Motion và no-JS giữ luồng nội dung bình thường.
- Store Story không dùng chỉ báo ba chấm. Section “Một góc Hoàng Long” hiển thị ba card ảnh đồng nhất gồm ảnh, số, tiêu đề và mô tả ngắn; chi tiết bố cục lấy cảm hứng cấu trúc ảnh–tiêu đề–mô tả của phần Năng lực cốt lõi Laztar, không sao chép style.
- Landing đã bỏ phần copy/scroll indicator của hero theo yêu cầu, thanh tiến độ số ở cạnh phải, heading Store Story, caption số/chữ phủ trên ảnh Story và metadata của ba ảnh gallery. Gallery không còn ghim toàn màn hình; CTA “Khám phá thêm” dùng chiều cao nội dung. Footer là panel bo tròn hai cột, gồm thông tin nhận diện và form liên hệ có validation trên trình duyệt. Form chưa gửi dữ liệu vì chưa có endpoint hoặc kênh nhận liên hệ; Facebook/TikTok mới là nhãn, chưa có URL được xác nhận.
- Nội dung landing được căn giữa theo chiều dọc trong vùng section trên desktop. Panel DENIS tiếp tục sticky sau khi thay chữ lớn; section sản phẩm trượt từ dưới lên phủ thay thế panel. Gallery chặn overlap với CTA “Khám phá thêm”. Đã bỏ toàn bộ nhãn số/chapter `01–05`, gồm eyebrow section, Story và danh sách range DENIS. Mobile giữ document flow.
- Section sản phẩm DENIS dùng `ProductsStage` CSS sticky trong track hai viewport: nội dung ghim ở tâm viewport trên desktop cho đến khi gallery trượt từ dưới lên phủ thay thế. Keyword workflow `SCENE-STICKY` tái sử dụng hành vi ghim tâm–section kế tiếp phủ cho các scope rõ ràng.

### Landing page đã duyệt và triển khai

- Người dùng yêu cầu home / trở thành landing page cuộn storytelling, giới thiệu cửa hàng và sản phẩm hãng DENIS.
- Kế hoạch chi tiết: [LANDING_PLAN.md](LANDING_PLAN.md), mã HOME-001. Người dùng duyệt bằng “tôi duyệt, hãy làm hiệu ứng xịn một tí nhé” ngày 2026-09-15. Đã triển khai sáu chương, animation GSAP, preset display và chuyển danh mục sang `/san-pham` (HOME-002).
- Đã xem 7 ảnh giới thiệu shop. API local hiện hoạt động; truy vấn hãng DENIS và danh sách lọc trả 7 sản phẩm, cả 7 chưa có imageUrl hoặc description (quan sát 2026-09-15).
- [public/images/shop/denis/](public/images/shop/denis/) nhận ảnh sản phẩm. Bản đầu dùng card chữ/dữ liệu thật khi chưa có ảnh; chương kết dẫn đến danh mục theo phạm vi rút gọn đã duyệt. Chưa công bố hotline/Zalo, địa chỉ hoặc giờ mở cửa khi chưa có nội dung xác nhận.
- Nâng cấp animation theo tham khảo VIKBLE nằm tại [MOTION_ENHANCEMENT_PLAN.md](MOTION_ENHANCEMENT_PLAN.md), mã MOTION-001. Người dùng đã xác nhận triển khai; MOTION-002 hoàn tất header sticky, rail tiến độ, hero/story/DENIS/gallery/CTA motion và skeleton một lượt.

## Tài liệu làm việc

- [AGENTS.md](AGENTS.md): quy trình AI, các bước cần người dùng xác nhận.
- [CHANGELOG.md](CHANGELOG.md): lịch sử quyết định, thay đổi và kết quả kiểm chứng.
- [README.md](README.md): cài đặt, chạy project và đồng bộ DTO.

PROJECT.md phản ánh trạng thái hiện tại. CHANGELOG.md giữ lịch sử và nguồn xác nhận. Một quyết định đã được duyệt không đồng nghĩa với việc đã triển khai hoặc kiểm thử xong.

## Công nghệ và môi trường

| Hạng mục       | Cấu hình                                            |
| -------------- | --------------------------------------------------- |
| Framework      | Next.js 16, App Router                              |
| Ngôn ngữ       | TypeScript strict                                   |
| Giao diện      | React 19, Tailwind CSS 4                            |
| HTTP           | Axios                                               |
| State toàn cục | Zustand, tạo store trong provider                   |
| DTO            | openapi-typescript                                  |
| Kiểm tra       | ESLint, TypeScript, Vitest, Prettier, Next.js build |
| Runtime        | Node.js >= 22.16                                    |
| Frontend local | http://localhost:3001                               |
| Backend local  | http://localhost:3000/api/v1                        |
| Swagger UI     | http://localhost:3000/docs                          |
| OpenAPI JSON   | http://localhost:3000/docs-json                     |

Chi tiết phiên bản theo [package.json](package.json) và lockfile.

## Kiến trúc bắt buộc

Luồng dữ liệu: `page → screen/component → hook → service → Axios config → backend`.

| Thư mục                         | Trách nhiệm                                       |
| ------------------------------- | ------------------------------------------------- |
| `src/app/`                      | Route, layout; page chỉ ghép/render screen        |
| `src/components/ui/`            | Thành phần cơ bản dùng lại                        |
| `src/components/layout/`        | Bố cục dùng chung                                 |
| `src/components/features/`      | Screen và thành phần theo tính năng               |
| `src/hooks/`                    | Data, loading, error, refetch và vòng đời request |
| `src/services/`                 | Gọi API, xử lý tham số và logic dữ liệu           |
| `src/api/`                      | Axios instance, config, endpoints, chuẩn hóa lỗi  |
| `src/stores/`, `src/providers/` | State chia sẻ và vòng đời store                   |
| `src/styles/`                   | Theme tokens và typography dùng chung             |
| `src/types/`                    | Generated types và aliases DTO                    |
| `src/config/`, `src/lib/`       | Cấu hình và tiện ích chung                        |

Không đặt lời gọi Axios trong component; không đưa React state vào service. Chỉ dùng Zustand cho state cần chia sẻ. Tách component theo trách nhiệm và khả năng dùng lại, tránh dồn giao diện vào page.

## Hợp đồng API

- Axios lấy base URL và timeout từ cấu hình env.
- Sinh DTO bằng `npm run api:generate`; không viết lại DTO backend bằng tay.
- Generated types: [src/types/generated/api.ts](src/types/generated/api.ts).
- Snapshot: [openapi/schema.json](openapi/schema.json).
- Aliases ứng dụng: [src/types/api.ts](src/types/api.ts).
- Snapshot ban đầu có 16 paths, 26 schemas, xuất từ bản build backend tại thời điểm endpoint chưa kết nối được. Chưa xác nhận khớp backend đang chạy.
- Giá sản phẩm là decimal string hoặc null; ngày trả về là ISO string.
- Chưa triển khai frontend đăng nhập và refresh token.

## Màn hình và component hiện có

| Nhóm              | Thành phần                                                                                                                     | Trạng thái                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Route `/`         | HomePage → LandingScreen; StackedScenes, Hero, StoreStory, DenisSpotlight, FeaturedDenisProducts, StoreGallery, ContactSection | Landing storytelling sáu chương với scene stack desktop                          |
| Route `/san-pham` | CatalogPage → CatalogScreen                                                                                                    | Query hãng/search/page; kiểm tra query trước khi gọi dữ liệu                     |
| Danh mục          | ProductCatalog, ProductToolbar, ProductCard                                                                                    | Có tìm kiếm, phân trang, loading/empty/error/thử lại                             |
| Layout            | Container, SiteHeader, SiteFooter                                                                                              | Thành phần dùng lại                                                              |
| UI                | Typography, Title, Subtitle, Paragraph, Button, Input, Card, Pagination, LoadingState, EmptyState                              | Thành phần dùng lại                                                              |
| Dữ liệu           | manufacturerService, catalogService, productService, useProducts, useDenisProducts                                             | Resolve tên hãng chính xác; abort/stale request protection; không bỏ lọc khi lỗi |
| State             | AppStoreProvider, productView                                                                                                  | Chuyển lưới/danh sách, chưa persist                                              |

Các component landing và thay đổi danh mục theo HOME-001 đã được duyệt. ScrollReveal, MediaFrame và ActionLink dùng lại giữa các section; Button và ActionLink dùng chung styles.

## Wireframe, style và theme

### Tài nguyên nhận diện của shop

- Thư mục cung cấp ảnh: [public/images/shop/](public/images/shop/).
- Logo: [public/images/shop/logo/](public/images/shop/logo/).
- Ảnh giới thiệu: [public/images/shop/introduction/](public/images/shop/introduction/).
- Hướng dẫn: [public/images/shop/README.md](public/images/shop/README.md).
- Yêu cầu mới: xây dựng theme dùng chung từ logo, gồm font, cỡ chữ, font weight, color và style toàn website.
- Đã nhận và xem [Logo_Hoang_Long.jpg](public/images/shop/logo/Logo_Hoang_Long.jpg), JPEG 1280 × 1280. Màu phổ biến nhất qua lấy mẫu là #C90A00; logo có biểu tượng và chữ trắng trên nền đỏ.
- Theme và kế hoạch component: [THEME_PLAN.md](THEME_PLAN.md), mã THEME-001. Người dùng đã xác nhận ngày 2026-09-15; đã áp dụng palette đỏ–trắng–than, font Be Vietnam Pro và transition màu 150 ms, tắt transition khi prefers-reduced-motion: reduce.
- Logo hiển thị qua BrandLogo dùng lại trong SiteHeader/SiteFooter, giữ nguyên ảnh gốc. Font 300/400/500/600/700 lưu local tại src/assets/fonts/be-vietnam-pro/, cấu hình tại src/config/fonts.ts, kèm giấy phép OFL.

### Quy ước thiết kế

- Figma hoặc Google Stitch AI là nguồn tham khảo thành phần, bố cục, phân cấp nội dung và luồng giao diện.
- Chỉ áp dụng style của wireframe khi người dùng yêu cầu rõ. Link wireframe tự nó không xác nhận màu, font hoặc hiệu ứng.
- Màu, font, cỡ chữ, font weight, line-height và biến thể cơ bản phải được định nghĩa tập trung và dùng lại.
- Nguồn theme: [src/styles/tokens.css](src/styles/tokens.css).
- Preset chữ: [src/styles/typography.ts](src/styles/typography.ts), [Typography](src/components/ui/typography.tsx).
- Ưu tiên component/preset/token sẵn có. Thiếu token cần đề xuất trong kế hoạch, được xác nhận rồi mới thêm vào nguồn dùng chung.
- Không tạo nhiều giá trị màu, cỡ chữ, weight hoặc style gần giống nhau riêng cho từng page/component.

### Trạng thái thiết kế cần phân biệt

| Nội dung   | Hiện trạng                                                                                         | Xác nhận của người dùng                                                      |
| ---------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Theme nền  | Đỏ #C90A00, trắng, nền #FAFAF9 và chữ than #18181B                                                 | Đã duyệt và triển khai THEME-001                                             |
| Typography | Be Vietnam Pro local; 10 preset và 5 weight                                                        | THEME-001 và display của HOME-001 đã duyệt/triển khai                        |
| Wireframe  | Chưa có link được cung cấp                                                                         | Chờ theo từng yêu cầu                                                        |
| Animation  | GSAP reveal/stagger, hero parallax, ảnh story sticky/crossfade, DENIS parallax; màu control 150 ms | HOME-001 đã duyệt; reduced motion bỏ reveal/parallax/sticky và smooth scroll |

Giữ hiện trạng khi chưa có yêu cầu sửa; không coi code scaffold là bằng chứng duyệt thiết kế hoặc animation.

Theme dùng chung: display 44–96 px/700, title 32–40 px/700, sectionTitle 24–28 px/600, subtitle 18–20 px/600, cardTitle 18 px/600, paragraph 16 px/400, label 14 px/500, button 14 px/600, caption 12 px/400, eyebrow 12 px/600. Font size và line-height nằm trong tokens.css; class preset nằm trong typography.ts. Hàm cn đã đăng ký cỡ chữ semantic để màu chữ không ghi đè font size.

Motion presets: `src/styles/motion.ts`; GSAP registration: `src/lib/gsap.ts`; story lifecycle: `src/hooks/use-scroll-story.ts`. Sticky chỉ dùng từ 1024 px, cao tối thiểu 700 px và khi nội dung vừa màn. Mặc định HTML/CSS hiển thị đủ nội dung; JavaScript bổ sung animation và tự cleanup khi đổi media/route.

Nội dung và ảnh shop: `src/config/landing.ts`. Ảnh sản phẩm dùng `imageUrl` của backend; thư mục ảnh DENIS là nơi nhận tài nguyên, chưa tự ánh xạ tên file vào mã hàng.

## Quy tắc phê duyệt

Trước khi tạo hoặc sửa giao diện:

1. Làm rõ các điểm chưa hiểu về ý tưởng thiết kế.
2. Đọc wireframe nếu được cung cấp, rà component và theme hiện có.
3. Lập kế hoạch liệt kê từng màn/route, component tạo mới/sửa/dùng lại, trạng thái và responsive.
4. Nêu rõ theme dùng chung và animation của từng màn/component; có thể gom nhóm khi cùng hành vi.
5. Chờ người dùng xác nhận kế hoạch và các mục còn mở trước khi triển khai phần phụ thuộc.

Chi tiết, mẫu kế hoạch và quy tắc cập nhật tài liệu nằm trong [AGENTS.md](AGENTS.md).

Mỗi thay đổi giao diện chỉ được bàn giao sau khi tự kiểm tra trực quan giao diện thật hoặc ảnh render tại các viewport liên quan, đối chiếu đầy đủ yêu cầu đã duyệt và ghi kết quả vào changelog.

## Kiểm chứng hiện có

**MOTION-002 (2026-09-15):** lint, typecheck, 16 unit/hook tests, production build và 8 Playwright tests đạt. Đã kiểm tra lại Edge headless ở 360×800, 768×1024, 1440×900 và 1440×600: rail desktop, header compact, sticky/crossfade story, bridge DENIS, card hover, gallery/CTA motion, resize, reduced motion, no-JavaScript và không overflow ngang. Đã xem screenshot hero, story, bridge DENIS, products, gallery, CTA trên desktop/mobile. Đây là kiểm tra trình duyệt headless; chưa kiểm tra Safari hoặc thiết bị cảm ứng thật.

**HOME-002 (2026-09-15):** 16 unit/hook tests và 7 Playwright tests đạt. Đã kiểm tra trên Edge headless ở 360×800, 768×1024, 1440×900 và 1440×600; không tràn ngang, story chuyển ảnh, cleanup khi resize/reduced motion, filter giữ qua search/page, quay lại home và nội dung tĩnh khi tắt JavaScript. Đã xem screenshot hero desktop/mobile, story và DENIS/products. Truy cập backend thật từ trình duyệt trả HTTP 200 cho manufacturers và products lọc DENIS; vùng home hiển thị 6 sản phẩm thật. Lint, typecheck và production build đã đạt. Đây là kiểm tra trình duyệt headless; chưa kiểm tra Safari hoặc thiết bị cảm ứng thật.

Các kết quả bên dưới là lịch sử của những lần setup trước:

Lần setup trước đã đạt lint, typecheck, 4 unit tests, build production, Prettier và HTTP smoke test trang chủ. Đã kiểm tra sinh type từ snapshot và giữ type cũ khi đồng bộ thất bại.

Chưa kiểm chứng tương tác trên trình duyệt và tích hợp backend đang chạy. Đây là lịch sử kiểm tra, không thay thế việc kiểm tra lại phần bị ảnh hưởng trong nhiệm vụ mới.

Lần áp dụng theme đã đạt lint, typecheck, 6 tests, production build và HTTP smoke test cho trang chủ, logo, CSS và font local. Đã kiểm tra CSS production có đủ 5 font weight, màu brand và reduced-motion override. Phiên làm việc không có trình duyệt kết nối nên chưa kiểm chứng trực quan tại 360/768/1440 px, keyboard hoặc animation thực tế.

### C?p nh?t DENIS-004 (2026-09-15)

Panel gi?i thi?u DENIS n?n t?i ?p d?ng SCENE-STICKY: sau khi thay ch? DENIS, to?n b? panel gi? gi?a viewport ??n khi section s?n ph?m n?n h?ng ph? k?n. Desktop enhanced d?ng bridge 330svh, animation v?o trong 130vh v? overlap section sau 100svh. Layout enhanced ???c g? khi ?i?u ki?n desktop/motion kh?ng c?n ph? h?p. ?? ki?m tra chuy?n c?nh xu?i/ng??c v? ?nh render desktop; xem CHANGELOG DENIS-004.

### C?p nh?t FOOTER-002

Trang ch? ??t ContactSection (Kh?m ph? th?m) trong SiteFooter, li?n kh?i li?n h?, kh?ng c? padding ho?c g?c bo t?o kho?ng tr?ng t?i ???ng n?i. C?c trang kh?c gi? footer hi?n c?.

### C?p nh?t HEADER-003

Header trang ch? ph? tr?n n?n ?nh hero, trong su?t, ch? tr?ng v? c?ng h? m?u inverse. Hero ch?a kho?ng cho header responsive; section c?u chuy?n v?n ph? header khi cu?n. Header c?c route kh?c gi? n?n ri?ng.
