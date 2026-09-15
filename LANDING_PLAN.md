# HOME-001 — Kế hoạch landing page storytelling Hoàng Long / DENIS

**Trạng thái:** đã được người dùng duyệt ngày 2026-09-15 bằng “tôi duyệt, hãy làm hiệu ứng xịn một tí nhé”; đã triển khai theo HOME-002. Xác nhận bao gồm sáu chương, chuyển danh mục, component, display và animation bên dưới. Bản đầu dùng phạm vi rút gọn mục 9: DENIS bằng dữ liệu/chữ khi thiếu ảnh, chương 06 dẫn đến danh mục trong lúc chưa có thông tin liên hệ.

Các mục đề xuất/cần duyệt bên dưới lưu nội dung kế hoạch tại thời điểm trình; trạng thái hiện tại theo đoạn trên, PROJECT.md và CHANGELOG.md.

## 1. Mục tiêu và thông tin đã xác minh

Trang / trở thành landing page giới thiệu Hoàng Long và sản phẩm hãng DENIS, dẫn khách qua các phần bằng cuộn trang.

Đã đọc source, xem 7 ảnh trong public/images/shop/introduction và kiểm tra API local ngày 2026-09-15:

- GET /api/v1/manufacturers?search=Denis trả về một hãng tên DENIS.
- ID quan sát được: 97c70770-9ccc-470a-864d-899d07a86dc4. Đây là dữ liệu môi trường hiện tại, không hardcode ID này vào UI.
- GET /api/v1/products?manufacturerId=... trả 7 sản phẩm; cả 7 có imageUrl và description bằng null.
- Có tên sản phẩm MAXSPEED cho xe số, SUPERIOR cho xe tay ga và Scooter Gear Oil. Không tự biến tên/thông số này thành cam kết công dụng, chứng nhận hay quan hệ đại lý.
- Ảnh cua-hang-1.jpg là mặt tiền; cua-hang-2.jpg là quầy; cua-hang-3.jpg là khu dầu nhớt nhiều hãng; cua-hang-4.jpg là ngăn phụ tùng; cua-hang-5.jpg là dãy lốp; cua-hang-6.jpg là kệ phụ tùng.
- logo-cua-hang.jpg thể hiện bảng hiệu trong phối cảnh; ưu tiên ảnh mặt tiền thực cua-hang-1.jpg cho giới thiệu cửa hàng.
- Chưa có wireframe, bài giới thiệu hoặc thông tin liên hệ được xác nhận cho trang này.

## 2. Định hướng mỹ thuật

- Dùng theme đã duyệt: đỏ #C90A00, trắng, than và Be Vietnam Pro.
- Ảnh cửa hàng lớn, chữ ngắn, bố cục có khoảng thở; xen kẽ nền sáng và một phần nền than để tạo nhịp kể chuyện.
- Giữ tông của ảnh gốc; dùng lớp phủ lấy từ token than khi đặt chữ trắng lên ảnh.
- Đề xuất thêm đúng một preset display: 44–96 px responsive, line-height 1.05, weight 700, phục vụ hero và tiêu đề hãng. Các chữ khác dùng 9 preset hiện có.
- Màu trên nền tối, lớp phủ ảnh và motion được khai báo tập trung trong tokens; không tạo các font/cỡ chữ/weight gần giống nhau cho từng section.
- Hình học đường chéo gợi từ logo có thể dùng làm chi tiết nền CSS tĩnh, không biến thành logo hãng DENIS.
- Nội dung thực phải đọc được ngay khi JavaScript/animation chưa sẵn sàng.

## 3. Mạch kể chuyện dự kiến

| Chương                   | Nội dung và bố cục                                                                | Ảnh/dữ liệu                                                                | Hành vi cuộn                                                                                   |
| ------------------------ | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 01 — Bước vào Hoàng Long | Hero gần một màn hình, tên shop lớn, câu dẫn ngắn, CTA Khám phá DENIS             | cua-hang-1.jpg                                                             | Chữ hiện lần lượt; ảnh dịch chuyển nhẹ theo cuộn desktop                                       |
| 02 — Khám phá cửa hàng   | Ba đoạn ngắn đi từ quầy đến ngăn phụ tùng và dãy hàng; ảnh bên phải, chữ bên trái | cua-hang-2/4/5.jpg                                                         | Desktop giữ khung ảnh bằng sticky trong khoảng 180vh, đổi ảnh theo ba mốc cuộn; mobile xếp dọc |
| 03 — Gặp DENIS           | Nền than, chữ DENIS nổi bật, giới thiệu các dòng đang có trong dữ liệu            | Tên dòng MAXSPEED, SUPERIOR, Scooter Gear Oil; ảnh DENIS nếu được cung cấp | Tiêu đề/đường nhấn xuất hiện; vùng hình/typography chuyển nhẹ theo cuộn                        |
| 04 — Sản phẩm DENIS      | Lưới tối đa 6 sản phẩm ban đầu và CTA xem toàn bộ DENIS                           | DTO/API thật                                                               | Các card xuất hiện theo nhóm, giữ thao tác bình thường                                         |
| 05 — Một góc Hoàng Long  | Cụm 3 ảnh cửa hàng có chú thích ngắn                                              | cua-hang-3/6 và một góc quầy                                               | Reveal nhẹ, không carousel tự chạy                                                             |
| 06 — Kết nối với shop    | Lời mời liên hệ hoặc ghé cửa hàng; thông tin chính thức                           | Chờ hotline/Zalo/địa chỉ/giờ mở cửa                                        | Nội dung hiện một lần; nút dùng transition theme                                               |

Bản nháp câu dẫn, cần người dùng duyệt: “Khám phá Hoàng Long. Tìm hiểu các dòng dầu nhớt DENIS đang có tại cửa hàng.”

Chương 02 dùng mô tả trung tính về những gì có trong ảnh. Số năm hoạt động, số khách hàng, đánh giá, xuất xứ, quyền phân phối và cam kết sản phẩm chỉ xuất hiện khi có thông tin xác nhận.

CTA ưu tiên đang đề xuất: Khám phá DENIS → danh sách DENIS → liên hệ tư vấn. Câu hỏi lựa chọn CTA đã gửi, chưa nhận câu trả lời cụ thể.

## 4. Màn hình/route

| Route                        | Thao tác                                      | Phạm vi                                                                         |
| ---------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------- |
| /                            | Thay màn danh mục mặc định bằng LandingScreen | Sáu chương trên, tiêu đề/metadata giới thiệu cửa hàng                           |
| /san-pham                    | Chuyển màn danh mục hiện có sang route riêng  | Tái sử dụng tìm kiếm, lưới/danh sách, phân trang, loading/empty/error           |
| /san-pham?manufacturer=DENIS | Biến thể cùng route danh mục                  | Lọc đúng hãng DENIS sau khi resolve tên hãng từ API; không tạo màn chi tiết mới |

Menu dùng liên kết Trang chủ, Giới thiệu, DENIS, Sản phẩm; liên kết Liên hệ chỉ có khi chương liên hệ đủ thông tin. Mobile cho menu xuống dòng/cuộn ngang tự nhiên, không thêm drawer trong kế hoạch.

## 5. Component sẽ tạo/sửa/dùng lại

| Thành phần                                                      | Hành động                              | Trách nhiệm và vị trí dự kiến                                                  |
| --------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------ |
| LandingScreen                                                   | Tạo mới                                | Ghép section tại src/components/features/landing/landing-screen.tsx            |
| LandingHero                                                     | Tạo mới                                | Chương 01, CTA và ảnh hero                                                     |
| StoreStory, StoryChapter                                        | Tạo mới                                | Chương 02 và từng đoạn kể chuyện dùng lại                                      |
| DenisSpotlight                                                  | Tạo mới                                | Chương 03, trình bày hãng và các dòng sản phẩm có trong dữ liệu                |
| FeaturedDenisProducts                                           | Tạo mới                                | Chương 04, dùng hook dữ liệu DENIS                                             |
| StoreGallery                                                    | Tạo mới                                | Chương 05, ảnh và chú thích                                                    |
| ContactSection                                                  | Tạo mới khi thông tin đã xác nhận      | Chương 06, liên kết gọi/Zalo/chỉ đường đúng đích                               |
| ScrollReveal                                                    | Tạo mới                                | Wrapper animation dùng chung tại src/components/motion/                        |
| MediaFrame                                                      | Tạo mới                                | Khung ảnh có kích thước, alt và fallback tại src/components/ui/                |
| ActionLink                                                      | Tạo mới                                | Liên kết CTA dùng chung style Button; dùng thẻ link thật cho điều hướng        |
| CatalogScreen                                                   | Chuyển/đặt lại tên HomeScreen hiện tại | Giữ màn danh mục riêng trong src/components/features/products/                 |
| ProductCard                                                     | Sửa                                    | Dùng lại cho danh mục và phần DENIS; hỗ trợ ảnh nếu có và trạng thái thiếu ảnh |
| ProductCatalog                                                  | Sửa                                    | Nhận bộ lọc hãng và giữ hãng khi tìm kiếm/phân trang                           |
| SiteHeader, SiteFooter                                          | Sửa                                    | Liên kết route/section, trạng thái active; tái dùng BrandLogo                  |
| Typography                                                      | Mở rộng preset                         | Thêm display tập trung, giữ preset còn lại                                     |
| Button, Input, Card, Container, BrandLogo, Pagination, Feedback | Dùng lại                               | Theme và hành vi hiện có                                                       |

Các component chương 01–06 nằm tại src/components/features/landing/. Page chỉ render screen. Không tạo nội dung UI dài trong page.tsx.

## 6. Công nghệ đề xuất

**Chọn GSAP + ScrollTrigger + @gsap/react** để điều phối timeline, hiệu ứng bám tiến độ cuộn và cleanup trong React. ScrollTrigger hỗ trợ scrub/pin; useGSAP quản lý vòng đời animation; gsap.matchMedia tách cấu hình desktop/mobile/reduced motion. Nguồn đã kiểm tra: [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [React/useGSAP](https://gsap.com/resources/React/), [matchMedia](<https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/>).

Đã khảo sát thêm [Motion useScroll](https://motion.dev/docs/react-use-scroll) và [Lenis](https://lenis.dev/). Phương án này dùng một hệ animation GSAP với cuộn gốc của trình duyệt, CSS sticky và transform/opacity. Chưa cần bổ sung thư viện cuộn mượt hoặc WebGL để thực hiện storyboard hiện tại.

Chọn bản stable tương thích tại lúc triển khai và khóa phiên bản bằng lockfile. “Đẹp nhất” là mục tiêu thiết kế cần đánh giá trên giao diện thật, không phải thuộc tính có thể đảm bảo chỉ bằng tên thư viện.

## 7. Animation cụ thể cần duyệt

| Thành phần                  | Trigger                            | Hiệu ứng và nhịp                                                                     | Mobile                         | Reduced motion                |
| --------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------ | ----------------------------- |
| Hero heading/CTA            | Trang sẵn sàng                     | Opacity 0→1, y 24→0; 700ms power3.out; stagger dòng 100ms                            | y 12px; 500ms                  | Hiển thị ngay                 |
| Ảnh hero                    | Cuộn qua hero                      | y 0→-48px, scale 1.04→1; scrub đồng bộ tiến độ, easing none                          | Ảnh tĩnh                       | Ảnh tĩnh                      |
| StoreStory                  | Cuộn qua 3 chương                  | Khung ảnh sticky; crossfade tại mốc chương; opacity/scale 1.02→1, không khóa cuộn    | Các chương xếp dọc, reveal nhẹ | Xếp dọc, tất cả nội dung tĩnh |
| DenisSpotlight              | Vào viewport                       | Chữ/đường nhấn reveal 700ms power3.out; vùng hình dịch tối đa 24px theo cuộn desktop | Bỏ chuyển động theo cuộn       | Tĩnh                          |
| ProductCard/Gallery/Contact | Vào viewport                       | Opacity và y 20→0; 600ms power3.out; stagger 80ms, chạy một lần                      | y 12px; 450ms                  | Hiển thị ngay                 |
| Button/link/input           | Hover/focus                        | Giữ transition màu 150ms ease-out đã duyệt                                           | Như theme                      | Không transition              |
| Điều hướng anchor           | Click mục giới thiệu/DENIS/liên hệ | Cuộn smooth gốc của trình duyệt, có scroll-margin cho header                         | Như desktop                    | Cuộn ngay                     |
| Loading/error/empty, logo   | Đổi dữ liệu/render                 | Tĩnh; không shimmer, spin hoặc autoplay                                              | Như desktop                    | Như desktop                   |

Motion presets mới nằm tại src/styles/motion.ts và tokens.css; hook useScrollStory quản lý ref, tiến độ và cleanup. Không dùng cuộn để khóa người dùng vào từng màn. Không có hiệu ứng tự lặp hoặc custom cursor trong phương án này.

Giới hạn sticky: chỉ desktop từ 1024px và đủ chiều cao viewport; khi chiều cao quá thấp, zoom lớn, nội dung không vừa hoặc reduced motion thì chuyển sang bố cục dọc. Kiểm tra tính đọc được của từng chương bằng bàn phím và khi quay lại route.

## 8. Dữ liệu và cấu trúc API

- Thêm aliases ManufacturerDto/ManufacturerListDto/ManufacturerQuery từ generated OpenAPI.
- manufacturerService gọi Axios config để tìm hãng; so khớp tên DENIS chính xác sau normalize, không chọn bừa phần tử đầu.
- useDenisProducts quản lý loading/error/empty, hủy request; chỉ gọi productService.list khi đã resolve được hãng.
- Khi resolve hãng thất bại, hiển thị lỗi/thử lại hoặc chưa có dữ liệu; không gọi danh sách không lọc và gắn nhãn DENIS.
- Không hardcode số lượng 7 vào nội dung thương hiệu; đó là số quan sát hiện tại.
- Dùng tên/mã/giá từ DTO. Mô tả quảng bá bổ sung cần nguồn xác nhận.
- Không tự chọn “bán chạy” nếu API không có dữ liệu bán hàng. Gọi vùng này là “Sản phẩm DENIS”.
- Danh mục giữ bộ lọc hãng khi tìm kiếm, đổi trang, refetch và quay lại; query string được xác thực trước khi dùng.
- Zustand tiếp tục quản lý productView; tiến độ scroll giữ ở ref/animation hook, không cập nhật global store mỗi frame.
- Nội dung giới thiệu tĩnh được render trước; lỗi API sản phẩm không chặn hero/câu chuyện/ảnh shop.

## 9. Ảnh và thông tin còn thiếu

- Chưa có ảnh sản phẩm DENIS: đã tạo public/images/shop/denis/ để nhận ảnh người dùng cung cấp.
- Bản đầu đề xuất phần hãng bằng chữ/đồ họa nền trừu tượng và card thông tin thật. Không tự dựng bao bì hoặc lấy ảnh sản phẩm hãng khác thay DENIS.
- Nếu người dùng cung cấp ảnh theo mã hàng, ánh xạ asset tại config tập trung hoặc dùng imageUrl từ backend; giữ tỷ lệ sản phẩm, có xử lý ảnh lỗi.
- Ảnh hãng khác trong ảnh cửa hàng chỉ dùng minh họa cửa hàng, không minh họa riêng cho DENIS.
- Cần xác nhận 2–3 điểm muốn kể về shop, hotline/Zalo, địa chỉ và giờ mở cửa.
- Thông tin trên biển hiệu chưa được xác nhận là thông tin hiện tại; không tự tạo số liên hệ hoặc link Zalo.
- Nếu muốn làm bản đầu trước khi bổ sung thông tin, cần đồng ý phạm vi rút gọn: chương 06 chưa có nút gọi/Zalo/chỉ đường; chỉ có CTA xem danh mục, không có trường giả.

## 10. Kiểm chứng sau khi được duyệt

- Lint, TypeScript, tests phù hợp và production build.
- API hãng và bộ lọc sản phẩm DENIS; thiếu hãng, API lỗi, ảnh null, giá null; đảm bảo không lẫn hãng khác.
- Responsive tại 360/768/1440 px và màn hình thấp; không overflow ngang ngoài vùng menu chủ ý.
- Keyboard/focus, anchor, chuyển route qua lại, vị trí scroll và query filter.
- Reduced motion: bỏ pin/parallax/reveal, nội dung vẫn đầy đủ; resize phải cleanup timeline cũ.
- Ưu tiên ảnh hero, lazy-load ảnh dưới màn hình, dùng sizes và tối ưu ảnh Next.js; tránh toàn bộ trang thành client component.
- Kiểm tra ảnh/chữ hiện được nếu animation chưa tải; không giữ nội dung ở opacity 0 khi lỗi.
- Khi có trình duyệt kết nối, kiểm tra thật từng mốc cuộn và video/screenshot; nếu chưa có, ghi đúng giới hạn kiểm chứng.

## 11. Mục cần người dùng xác nhận trước khi triển khai

1. Sáu chương và việc chuyển danh mục hiện tại sang /san-pham.
2. Danh sách component cùng preset display 44–96px.
3. GSAP và animation mục 7.
4. Hành động chính: đề xuất xem DENIS rồi liên hệ.
5. Dùng bố cục chữ/thông tin thật trong phần DENIS khi chưa có ảnh; bổ sung ảnh sản phẩm sau.
6. Nội dung cửa hàng/liên hệ, hoặc đồng ý phạm vi rút gọn mục 9.

Nguồn yêu cầu ban đầu: home là landing page cuộn storytelling, giới thiệu shop và manufacturer “Denis”; tiếp đó yêu cầu “tiếp tục”. Nguồn duyệt sau khi trình kế hoạch: “tôi duyệt, hãy làm hiệu ứng xịn một tí nhé”. Chi tiết thực hiện và kiểm chứng tại HOME-002 trong CHANGELOG.md.
