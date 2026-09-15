# Changelog — Phụ Tùng Hoàng Long Frontend

## Cách ghi nhận

- Ghi mới ở đầu phần lịch sử; giữ nguyên các bản ghi cũ.
- Mỗi bản ghi có ID, ngày, phạm vi, trước/sau, lý do, nguồn xác nhận, trạng thái triển khai và kết quả kiểm chứng.
- Phân biệt quyết định đã xác nhận, đề xuất/chờ xác nhận, đã triển khai và đã kiểm chứng.
- Ghi rõ các màn/component và token/animation bị ảnh hưởng khi có thay đổi thiết kế.
- Quyết định mới chỉ thay thế bản cũ trong phạm vi được xác nhận; dẫn ID bản cũ, không xóa lịch sử.
- Không ghi đề xuất của AI thành yêu cầu đã được người dùng duyệt.

## Lịch sử

### HEADER-003 ? 2026-09-15 ? Header chung n?n hero

- **Y?u c?u:** header li?n kh?i section ??u, chung background v? ch? d? ??c.
- **Tri?n khai:** header trang ch? absolute to?n chi?u r?ng, n?n trong su?t; ch? tr?ng v? hover s?ng; t?ng l?p t?i ??u ?nh hero, ch?a kho?ng cho header tr?n desktop/mobile. Gi? section c?u chuy?n ph? header khi cu?n.
- **Ki?m ch?ng:** ?nh render desktop/mobile, hero v? header c?ng top=0, kh?ng tr?n ngang; m?u computed c?a c?c link tr?ng; hit-test section c?u chuy?n ph? header ??t. Typecheck v? lint ??t.

### FOOTER-002 ? 2026-09-15 ? G?p kh?m ph? th?m v? li?n h?

- **Y?u c?u:** g?p hai kh?i trong ?nh v?o footer, kh?ng c? kho?ng tr?ng gi?a ch?ng.
- **Tri?n khai:** chuy?n ContactSection t? LandingScreen v?o SiteFooter tr?n trang ch?; b? padding tr?n v? bo g?c t?i ???ng n?i hai kh?i. Gi? component, n?i dung v? theme hi?n c?.
- **Ki?m ch?ng:** ?o kho?ng c?ch b?ng 0 tr?n viewport r?ng 1440 v? 390px, kh?ng tr?n ngang; ki?m tra ?nh desktop. Typecheck v? lint c?c component thay ??i ??t.

### DENIS-004 ? 2026-09-15 ? Gi? panel DENIS ??ng y?n ??n khi ???c ph? k?n

- **X?c nh?n:** y?u c?u s?a panel n?n t?i trong ?nh; ti?p t?c hi?u ?ng SCENE-STICKY ?? duy?t.
- **Ph?m vi:** DenisSpotlight, landing.css v? ki?m th? chuy?n c?nh route `/`. C?c b?n SCENE-001/002 s?a danh s?ch s?n ph?m ch?a gi?i quy?t panel DENIS trong y?u c?u n?y.
- **Thay ??i:** k?o d?i bridge l?n 330svh, gi? animation thay ch? DENIS trong 130vh ??u; section s?n ph?m overlap 100svh ?? ph? tr?n panel trong khi panel v?n sticky. N?n stage t?i che ho?n to?n ch? DENIS c?. Ch? k?ch ho?t layout n?y khi JavaScript v? ?i?u ki?n desktop cho ph?p motion.
- **Ki?m ch?ng:** hai Playwright test ??t; ki?m tra panel top=0 khi section sau ? y=900, 450, 1 v? cu?n ng??c. ?? xem ?nh ??u, gi?a v? cu?i chuy?n c?nh ? 1440?900. Typecheck v? lint c?c file TypeScript s?a ??i ??t.
- **Tr?ng th?i:** ho?n t?t.

### SCENE-002 — 2026-09-15 — Giữ ProductsStage cố định trong lúc gallery phủ

- **Nguồn xác nhận:** người dùng báo nội dung sản phẩm vẫn bị kéo theo section thay vì sticky.
- **Phạm vi:** route `/`; FeaturedDenisProducts, CSS landing, Playwright E2E, PROJECT.md và CHANGELOG.md.
- **Trước/sau:** `ProductsStage` dựa vào ScrollTrigger pin cả section nên có thể trôi theo section trong nhịp gallery vào. Sau thay đổi, section sản phẩm có track cao hai viewport, `ProductsStage` dùng CSS `position: sticky` với chiều cao một viewport, và gallery bắt đầu từ đáy bằng overlap 100svh để phủ xuyên suốt khi stage vẫn cố định.
- **Responsive/theme:** cơ chế sticky/overlap chỉ desktop; mobile, viewport thấp, Reduced Motion và no-JS giữ document flow. Không đổi content, token, API, service hay Zustand.
- **Kiểm chứng:** Prettier, lint, typecheck và 2 Playwright E2E chuyên biệt đạt. Đã xem ảnh render desktop 1440 × 900 ở giữa transition: stage giữ top 0/bottom 900, gallery ở y=680 và phủ phần dưới.
- **Trạng thái:** hoàn tất.

### SCENE-001 — 2026-09-15 — Stage sticky cho sản phẩm DENIS

- **Nguồn xác nhận:** người dùng xác nhận áp dụng hiệu ứng section đầu tiên cho Section sản phẩm DENIS và yêu cầu tạo keyword tái sử dụng trong AGENTS.md.
- **Phạm vi:** route `/`; ProductsStage, FeaturedDenisProducts, CSS landing, AGENTS.md, Playwright E2E, PROJECT.md và CHANGELOG.md.
- **Trước/sau:** Section sản phẩm được pin ở cấp section nhưng không có stage nội dung riêng và tâm stage lệch 48 px do padding section. Sau thay đổi, `ProductsStage` giữ heading, CTA và trạng thái catalog trong vùng có tâm trùng viewport; gallery tiếp tục trượt từ dưới lên phủ stage.
- **Keyword:** `SCENE-STICKY` là xác nhận sẵn cho animation desktop ghim nội dung giữa viewport và section kế tiếp phủ thay thế, khi scope screen/component đã rõ. Keyword vẫn yêu cầu kế hoạch ngắn cho content/theme/responsive/kiểm chứng.
- **Responsive/theme:** chỉ kích hoạt stage stack trên desktop đủ kích thước; mobile, viewport thấp, Reduced Motion và no-JS giữ document flow. Không đổi palette, typography, dữ liệu, API, service hoặc Zustand.
- **Kiểm chứng:** Prettier, lint, typecheck và 2 Playwright E2E chuyên biệt đạt. Đã xem ảnh render desktop 1440 × 900; tâm stage là 450 px, trùng tâm viewport, gallery xuất hiện từ đáy khi phủ stage.
- **Trạng thái:** hoàn tất.

### WORKFLOW-002 — 2026-09-15 — Bắt buộc tự kiểm tra trực quan sau thay đổi UI

- **Nguồn xác nhận:** người dùng yêu cầu bổ sung quy trình: sau khi làm xong giao diện phải tự kiểm tra lại để xác nhận đã đúng yêu cầu.
- **Phạm vi:** AGENTS.md, PROJECT.md và CHANGELOG.md.
- **Thay đổi:** thêm bước bắt buộc render/mở giao diện ở viewport liên quan, đối chiếu từng yêu cầu đã duyệt và lặp lại việc sửa–kiểm tra nếu phát hiện sai. Với animation/scroll, phải kiểm tra đầu, giữa và cuối transition, sticky/overlap/layer; không được đánh dấu hoàn tất chỉ vì code hoặc test tự động đạt.
- **Ghi nhận:** kết quả tự kiểm tra trực quan, viewport và giới hạn phải được ghi trong changelog của thay đổi UI.
- **Trạng thái:** hoàn tất.

### DENIS-003 — 2026-09-15 — Sản phẩm phủ lên panel Denis sticky

- **Nguồn xác nhận:** người dùng yêu cầu panel giới thiệu dầu nhớt sau khi thay chữ `DENIS.` tiếp tục sticky cùng section, rồi section sau trượt lên thay thế; kế hoạch được xác nhận bằng “ok”.
- **Phạm vi:** route `/`; CSS stack landing, Playwright E2E, PROJECT.md và CHANGELOG.md.
- **Trước/sau:** overlap DENIS→sản phẩm bị tắt để tránh section sau lộ vào panel. Sau thay đổi, Section sản phẩm trở lại nhịp scene xếp lớp: bắt đầu từ đáy viewport khi panel DENIS còn sticky, rồi trượt lên phủ toàn bộ panel.
- **Responsive/animation:** chỉ desktop dùng overlap stack; mobile, Reduced Motion và no-JS vẫn theo document flow. Không đổi content, token, API, service hoặc Zustand.
- **Kiểm chứng:** Prettier, lint, typecheck và hai Playwright E2E chuyên biệt đạt. Đã xem ảnh render desktop 1440 × 900 ở điểm bàn giao: panel còn sticky, Section sản phẩm xuất hiện từ đáy với lớp cao hơn.
- **Trạng thái:** hoàn tất.

### HOME-004 — 2026-09-15 — Căn giữa section và bỏ toàn bộ nhãn số

- **Nguồn xác nhận:** người dùng yêu cầu căn giữa nội dung của tất cả section, bỏ các nhãn `01`, `02`, `03`, `04` còn lại; đồng thời xác nhận xử lý overlap DENIS và CTA gallery bằng “triển khai đi”.
- **Phạm vi:** route `/`; LandingHero, StoryContent, DenisSpotlight, FeaturedDenisProducts, StoreGallery, ContactSection, CSS stack/landing, Playwright E2E, PROJECT.md và CHANGELOG.md.
- **Trước/sau:** content của nhiều section bắt đầu ở nửa trên; panel DENIS có thể lộ section sản phẩm kế tiếp, CTA cuối phủ ảnh gallery; các eyebrow/chapter/range còn hiển thị số. Sau thay đổi, hero, product, gallery và CTA có wrapper căn giữa; stage Story/DENIS tiếp tục giữ tâm sẵn có. Overlap DENIS→sản phẩm và gallery→CTA bị tắt. Các nhãn số section, Story và danh sách range DENIS đều bị bỏ.
- **Responsive/theme:** căn giữa theo viewport chỉ áp dụng desktop cho section lớn; CTA dùng chiều cao gọn nhưng nội dung vẫn căn giữa. Mobile, Reduced Motion và no-JS giữ document flow. Không đổi token hoặc dữ liệu API.
- **Kiểm chứng:** Prettier, lint, typecheck, 16 Vitest tests và production build đạt. Ba Playwright E2E chuyên biệt đạt: panel DENIS phủ kín stage, gallery chỉ hiển thị ảnh và landing không còn nhãn số; đã xem ảnh render desktop 1440 × 900 của DENIS và gallery.
- **Trạng thái:** hoàn tất.

### HOME-003 — 2026-09-15 — Rút gọn landing và thay footer liên hệ

- **Nguồn xác nhận:** người dùng yêu cầu bỏ copy/scroll indicator hero, các mục số section, heading Store Story, số/caption ảnh và metadata gallery; thu nhỏ section “Tiếp tục khám phá”; footer lấy ý tưởng bố cục từ ảnh tham khảo. Kế hoạch được xác nhận bằng “ok”.
- **Phạm vi:** route `/`; LandingHero, LandingScreen, StoreStory, StoryStage, StoreGallery, StoreGalleryCapabilityCard, ContactSection, SiteFooter, FooterContactForm, CSS landing, Playwright E2E, PROJECT.md và CHANGELOG.md. `SectionProgress` đã bị xóa do không còn dùng.
- **Trước/sau:** hero có nhiều copy phụ và scroll link; Story có heading/caption số; gallery có metadata dưới ảnh, ghim toàn màn hình; CTA cuối cao tối thiểu một viewport; footer chỉ có logo. Sau thay đổi, các phần nêu trên được bỏ, gallery chỉ hiển thị ảnh và cuộn theo document flow, CTA cuối dùng chiều cao nội dung. Footer trở thành panel bo tròn hai cột với nhận diện/social/copyright và form liên hệ.
- **Theme/animation:** footer dùng brand-50, brand đỏ, surface và typography đã có, không tạo token mới. Cấu trúc lấy cảm hứng từ ảnh tham khảo: vùng bo tròn, cột theo dõi và cột form; không sao chép màu xanh hay icon của nguồn. Các animation liên quan phần đã bỏ cũng không còn render; animation còn lại, mobile, Reduced Motion và no-JS giữ fallback phù hợp.
- **Dữ liệu/liên hệ:** form kiểm tra required/email ở trình duyệt và hiển thị rõ trạng thái chờ kết nối kênh tiếp nhận. Không gửi dữ liệu ra ngoài; chưa tạo URL Facebook/TikTok, hotline hoặc email vì chưa được cung cấp.
- **Kiểm chứng:** Prettier, lint, typecheck, 16 Vitest tests, production build và 16 Playwright tests đạt. Đã xem ảnh render desktop 1440 × 900 của gallery, CTA thu gọn và footer; E2E xác nhận không còn navigation số, gallery chỉ còn ảnh và form hiển thị rõ trạng thái chưa gửi ra ngoài.
- **Trạng thái:** hoàn tất.

### DENIS-002 — 2026-09-15 — Panel sản phẩm thay thế chữ DENIS

- **Nguồn xác nhận:** người dùng yêu cầu phần giới thiệu dòng dầu trong Section 03 trượt lên thay thế chữ `DENIS.` và xác nhận kế hoạch bằng “ok”.
- **Phạm vi:** route `/`; `DenisSpotlight`, GSAP timeline Denis, CSS landing, Playwright E2E, PROJECT.md và CHANGELOG.md.
- **Trước/sau:** bridge ghim chỉ animate chữ `DENIS.` và copy phụ; panel giới thiệu xuất hiện sau bridge theo document flow. Sau thay đổi, panel là lớp thứ hai trong cùng stage ghim, bắt đầu ở dưới viewport rồi đi lên phủ kín stage. `DENIS.` và copy phụ mờ hết trước khi panel hoàn tất.
- **Responsive/animation:** transition scrub chỉ chạy desktop theo bridge hiện có. Nội dung tĩnh, thứ tự đọc, CTA và fallback mobile/Reduced Motion/no-JS được giữ nguyên.
- **Theme/data:** dùng palette nền tối, typography, rule, danh sách range và CTA có sẵn; không đổi token, dữ liệu, API, service hay Zustand.
- **Kiểm chứng:** Prettier, lint, typecheck, 16 Vitest tests, production build và Playwright E2E chuyên biệt đạt. E2E kiểm tra panel phủ từ đỉnh đến đáy stage khi chữ `DENIS.` có opacity không quá 0.01; đã xem ảnh render desktop 1440 × 900.
- **Trạng thái:** hoàn tất.

### STORY-004 — 2026-09-15 — Tạo khoảng chuyển tiếp cho chữ Store Story

- **Nguồn xác nhận:** người dùng báo hai khối chữ chồng lên nhau, yêu cầu tạo khoảng trống để chữ trước lướt lên và chữ sau từ dưới thay thế trong không gian giữa section; kế hoạch được xác nhận bằng “ok”.
- **Phạm vi:** route `/`; `StoryStage`, `useScrollStory`, CSS Story, Playwright E2E, PROJECT.md, STACKING_PLAN.md và CHANGELOG.md.
- **Trước/sau:** text cũ chỉ đi 12 px còn text mới bắt đầu ngay tại tâm nên nội dung bị đè trong lúc crossfade. Sau thay đổi, mỗi khối text được animate độc lập: khối cũ đi lên 160 px, khối mới đi từ dưới lên 160 px vào tâm. Vùng cột chữ được cắt theo stage để chuyển động luôn nằm trong không gian section.
- **Responsive/animation:** chỉ áp dụng trong stage desktop đủ kích thước; ảnh vẫn crossfade độc lập. Mobile, viewport thấp, Reduced Motion và no-JS không thay đổi.
- **Theme/data:** không đổi token, typography, ảnh, API, service, hook dữ liệu hoặc Zustand.
- **Kiểm chứng:** Prettier, lint, typecheck, 16 Vitest tests và production build đạt. Hai Playwright E2E chuyên biệt đạt: text active trở về tâm cạnh khung ảnh sau transition, và tại điểm giữa hai khối text cách nhau tối thiểu 140 px.
- **Trạng thái:** hoàn tất.

### STORY-003 — 2026-09-15 — Ghim trọn stage Store Story

- **Nguồn xác nhận:** người dùng yêu cầu cả chữ và hình ở section 2 luôn ghim ở chính giữa chiều dọc, không đi theo scroll, và xác nhận kế hoạch bằng “ok”.
- **Phạm vi:** route `/`; `StoreStory`, `StoryStage`, `StoryContent`, `StoryChapter`, `useScrollStory`, CSS Story, Playwright E2E, PROJECT.md, STACKING_PLAN.md và CHANGELOG.md.
- **Trước/sau:** mỗi chapter tự giữ wrapper chữ, vì vậy vị trí có thể nhả khi chuyển chapter. Sau thay đổi, `StoryStage` là một stage sticky duy nhất cho toàn bộ nhịp cuộn; cột chữ và cột ảnh cùng được căn giữa theo chiều dọc. `StoryChapter` chỉ còn làm scroll driver và fallback trong document flow.
- **Responsive/animation:** stage sticky chỉ chạy desktop từ 1024 px và cao từ 700 px. Cả text lẫn ảnh chỉ thay đổi opacity trong stage: ảnh crossfade; chữ cũ nhấc 12 px rồi mờ dần, chữ mới hiện ngay giữa. Mobile, viewport thấp, Reduced Motion và no-JS vẫn dùng nội dung tĩnh theo document flow.
- **Theme/data:** tái sử dụng MediaFrame, Typography, palette và type scale hiện có; không đổi token, API, service, hook dữ liệu hoặc Zustand.
- **Kiểm chứng:** Prettier, lint, typecheck, 16 Vitest tests và 13 Playwright tests đạt. E2E kiểm tra stage sticky và xác nhận tâm text active trùng tâm cột ảnh ở chapter giữa.
- **Trạng thái:** hoàn tất. Thay thế cơ chế ghim theo `StoryChapter` của STORY-002 trong phạm vi Store Story.

### STORY-002 — 2026-09-15 — Giữ chữ Store Story tại tâm section

- **Nguồn xác nhận:** người dùng yêu cầu chữ không đi lên xa trước khi mờ; sau đó yêu cầu chữ luôn ở giữa section, ngang tâm khung ảnh, và xác nhận kế hoạch bằng “oke”.
- **Phạm vi:** route `/`; `StoryChapter`, `useScrollStory`, CSS Story, Playwright E2E, PROJECT.md, STACKING_PLAN.md và CHANGELOG.md.
- **Trước/sau:** nội dung chương nằm trong document flow và chữ mới đi lên từ dưới. Sau thay đổi, wrapper `story-content-pin` sticky tại 50% viewport; chữ cũ chỉ nhấc 12 px rồi fade out, chữ mới fade in tại vị trí trung tâm đó.
- **Responsive/animation:** sticky chỉ chạy desktop từ 1024 px và cao từ 700 px. Mobile, viewport thấp, Reduced Motion và no-JS giữ document flow tĩnh. Ảnh vẫn crossfade trong timeline chung.
- **Theme/data:** không đổi token, font, component UI, API, service, hook dữ liệu hoặc Zustand.
- **Kiểm chứng:** xem trực quan desktop 1440 × 900: tâm chữ active, tâm khung ảnh và tâm viewport đều là 450 px; không overflow ngang. Prettier, lint, typecheck, 16 Vitest tests, production build và 13 Playwright tests đều đạt.
- **Trạng thái:** hoàn tất. Thay thế vị trí chữ của STORY-001 trong phạm vi Store Story.

### STORY-001 — 2026-09-15 — Crossfade ảnh và chữ Store Story đồng bộ

- **Nguồn xác nhận:** người dùng yêu cầu đổi ba ảnh sang fade, không hiển thị ba lớp; sau đó yêu cầu chữ trái trượt lên/mờ dần đồng bộ và xác nhận kế hoạch bằng “oke”.
- **Phạm vi:** route `/`; `useScrollStory`, CSS Story, Playwright E2E, PROJECT.md, STACKING_PLAN.md và CHANGELOG.md.
- **Trước/sau:** ảnh dùng scale, dịch chuyển, xoay và opacity để tạo chiều sâu. Sau thay đổi, ảnh cũ fade về opacity 0, ảnh mới fade lên opacity 1 tại cùng vị trí; chữ cũ trượt lên/mờ dần, chữ mới trượt từ dưới lên/rõ dần trong cùng ScrollTrigger timeline.
- **Responsive/animation:** chỉ chạy desktop từ 1024 px và cao từ 700 px. Mobile, viewport thấp, Reduced Motion và no-JS dùng document flow tĩnh. Không còn perspective, shadow layer hoặc transform trên panel ảnh.
- **Theme/data:** không đổi token, font, component, API, service, hook dữ liệu hoặc Zustand.
- **Kiểm chứng:** xem trực quan desktop 1440 × 900 tại giữa transition: panel ảnh không transform, opacity ảnh/chữ thay đổi đồng bộ và không overflow ngang. Prettier, lint, typecheck, 16 Vitest tests, production build và 12 Playwright tests đều đạt.
- **Trạng thái:** hoàn tất. Thay thế hiệu ứng layer ảnh của STACK-001 trong phạm vi Store Story.

### GALLERY-001 — 2026-09-15 — Card ảnh cửa hàng theo cấu trúc năng lực cốt lõi

- **Nguồn xác nhận:** người dùng yêu cầu bỏ chỉ báo ba chấm trong ảnh, tham khảo Năng lực cốt lõi Laztar cho phần ảnh cửa hàng, và xác nhận kế hoạch bằng “oke”.
- **Phạm vi:** route `/`; `StoreStory`, `useScrollStory`, `StoreGallery`, `StoreGalleryCapabilityCard`, `landingContent`, CSS landing, Playwright E2E, PROJECT.md và CHANGELOG.md.
- **Trước/sau:** Store Story có progress pill ba chấm; gallery dùng masonry ảnh với caption ngắn. Sau thay đổi, pill và GSAP/CSS liên quan bị xóa; gallery dùng ba card đồng nhất gồm ảnh, số thứ tự, tiêu đề và mô tả ngắn từ config.
- **Tham chiếu:** [Laztar – Năng lực cốt lõi](https://laztar.com/) chỉ dùng cấu trúc ảnh minh họa–tiêu đề–mô tả; không sao chép palette, typography, illustration, nội dung hay hiệu ứng của Laztar.
- **Theme/animation:** dùng lại MediaFrame, Typography, palette và motion clip/parallax ảnh hiện có. Caption card hiển thị tĩnh để vẫn đọc được khi đi thẳng tới section; không thêm token, API, service, hook dữ liệu hoặc Zustand. Reduced Motion vẫn tĩnh.
- **Kiểm chứng:** xem desktop 1440 × 900 và mobile 390 × 844; ba card xuất hiện, không còn progress pill và không overflow ngang. Prettier, lint, typecheck, 16 Vitest tests, production build và 12 Playwright tests đều đạt.
- **Trạng thái:** hoàn tất.

### STACK-003 — 2026-09-15 — Header chỉ ghim trong Hero

- **Nguồn xác nhận:** người dùng yêu cầu header chỉ sticky trong section 1 và bị section 2 che; sau khi kế hoạch được trình bày, người dùng xác nhận.
- **Phạm vi:** route `/`; `SiteHeader`, `LandingHeaderPin`, `LandingScreen`, CSS landing, Playwright E2E, PROJECT.md và CHANGELOG.md.
- **Trước/sau:** header sticky trên toàn trang. Sau thay đổi, ScrollTrigger pin header từ đầu Hero đến khi Store Story chạm đỉnh; sau đó header trở về vị trí document và Store Story phủ lên. Các route khác giữ sticky hiện có.
- **Responsive/animation:** pin chỉ chạy desktop từ 1024 px và cao từ 700 px. Mobile, viewport thấp, Reduced Motion và no-JS dùng header theo luồng document; không thêm motion mới ngoài hành vi stack đã được duyệt.
- **Theme/data:** không đổi token, typography, API, service, hook dữ liệu hay Zustand.
- **Kiểm chứng:** xem trực quan desktop 1440 × 900: header fixed trong Hero; khi Store Story chạm `top: 0`, header trở thành relative, nằm ngoài viewport và không overflow ngang. Prettier, lint, typecheck, 16 Vitest tests, production build và 11 Playwright tests đều đạt.
- **Trạng thái:** hoàn tất.

### STACK-002 — 2026-09-15 — Phân biệt nền các section xếp lớp

- **Nguồn xác nhận:** người dùng yêu cầu các section có nền gần giống nhau phải rõ ràng hơn, sau đó xác nhận kế hoạch bằng “ok”.
- **Phạm vi:** route `/`; `FeaturedDenisProducts`, `StoreGallery`, PROJECT.md và CHANGELOG.md.
- **Trước/sau:** Products DENIS và gallery cùng nền trắng `surface`. Products chuyển sang `brand-50` đỏ nhạt; gallery dùng `background` trắng ngà. Hero than, Store Story trắng, DENIS than và CTA đỏ giữ nguyên.
- **Theme/animation:** chỉ dùng token màu đã duyệt; không thêm font, color token, component, API/state hay animation. Cơ chế section stack và Reduced Motion không đổi.
- **Kiểm chứng:** xem trực quan desktop 1440 × 900 ở Products và Gallery; `brand-50` là `rgb(255, 241, 240)`, `background` là `rgb(250, 250, 249)`, không overflow ngang. Prettier, lint, typecheck, 16 Vitest tests, production build và 10 Playwright tests đều đạt.
- **Trạng thái:** hoàn tất.

### STACK-001 — 2026-09-15 — Section stack và Story image layers

- **Nguồn xác nhận:** người dùng yêu cầu section hiện tại giữ vị trí khi cuộn, section tiếp theo trượt lên phủ lên; sau đó chọn “phương án 3” cho ba ảnh Store Story.
- **Phạm vi:** route `/`; `LandingScreen`, `StackedScenes`, sáu section landing, `useScrollStory`, CSS landing, root layout và Playwright E2E.
- **Trước/sau:** overlap tĩnh `-8vh` không tạo trạng thái ghim rõ ràng. Sau thay đổi, Hero, sản phẩm DENIS và gallery được ScrollTrigger pin đến khi section kế tiếp chạm đỉnh; các section sau có nền rõ ràng và phủ lên từ dưới. Store Story/DENIS giữ pin nội bộ đã có.
- **Animation:** ảnh mới của Story đi vào lớp trước; ảnh liền trước thu nhỏ/dịch trái/mờ dần; ảnh cũ nhất lùi xa hơn. Chỉ chạy desktop từ 1024 px và cao từ 700 px; mobile, viewport thấp, Reduced Motion và no-JS dùng document flow.
- **Theme/token:** dùng lại token red–white–charcoal, Be Vietnam Pro, spacing và shadow hiện có; không thêm style font, weight hay color riêng.
- **Kiểm chứng:** xem trực quan desktop 1440 × 900 ở điểm Story phủ hero và chapter 3; kiểm tra không overflow ngang. Prettier, lint, typecheck, 16 Vitest tests, production build và 10 Playwright tests đều đạt.
- **Trạng thái:** hoàn tất. Bổ sung cách chuyển cảnh trong phạm vi MOTION-002 mà không thay API, DTO, service, hook dữ liệu hoặc Zustand.

### MOTION-002 — 2026-09-15 — Triển khai motion storytelling nâng cấp

- **Nguồn xác nhận:** người dùng trả lời “tôi xác nhận, hãy triển khai” cho MOTION-001.
- **Phạm vi:** route `/`; SiteHeader, hero, StoreStory, DenisSpotlight, FeaturedDenisProducts/ProductCard, StoreGallery, ContactSection, ActionLink và landing screen.
- **Sau:** header sticky thu gọn khi rời hero; rail điều hướng sáu chương desktop qua IntersectionObserver; hero word-mask/exit parallax; story crossfade scale/clip-path với dot progress; bridge DENIS sticky; stagger card xen kẽ và hover/focus feedback; mask/parallax gallery; CTA word-mask/dải nền; skeleton card sheen một lượt.
- **Kiến trúc/theme:** tạo `MotionText`, `SectionProgress`, `ProductSkeleton`; mở rộng `ScrollReveal` bằng variant cards. Motion tập trung tại `motion.ts`, CSS tại `landing.css`; không thêm thư viện, không thay API/DTO/service/hook/Zustand hoặc palette/font/type scale.
- **Responsive/accessibility:** rail chỉ desktop; mobile bỏ sticky bridge/story và dùng reveal ngắn; reduced motion tắt tween, scrub, pin, parallax, smooth scroll và sheen; HTML vẫn đọc được khi JavaScript tắt. Link tiến độ và CTA có nhãn/keyboard focus.
- **Sửa kỹ thuật:** section bridge DENIS cao 230svh để CSS sticky có hành trình cuộn 130svh thực tế khi pin cao một viewport; dùng `overflow: clip` để tránh overflow ngang mà không phá sticky.
- **Kiểm chứng:** Prettier, lint, typecheck, 16 Vitest tests, production build và 8 Playwright tests đạt. Edge headless 360×800, 768×1024, 1440×900, 1440×600: không page error/overflow ngang, rail/header/bridge/card hover, resize/reduced-motion/no-JS, data filter và điều hướng hoạt động. Đã kiểm tra trực quan hero, story, DENIS, products, gallery và CTA desktop/mobile.
- **Giới hạn:** không tự tạo video hoặc ảnh DENIS; card vẫn dùng DTO thật khi ảnh rỗng. Kiểm tra Safari/thiết bị cảm ứng thật chưa thực hiện.
- **Trạng thái:** hoàn tất. MOTION-001 chuyển từ đề xuất sang đã duyệt/triển khai.

### MOTION-001 — 2026-09-15 — Khảo sát VIKBLE và đề xuất nâng cấp animation

- **Phạm vi:** đọc trực tiếp [vikble.com](https://vikble.com/) trên desktop/mobile; đối chiếu landing HOME-002; lập [MOTION_ENHANCEMENT_PLAN.md](MOTION_ENHANCEMENT_PLAN.md).
- **Quan sát:** trang tham khảo dùng hero media toàn màn hình, nhiều section sticky, transform/opacity theo tiến độ cuộn, chuyển cảnh logo/heading quy mô lớn, card stagger và bố cục mobile rút gọn. Phép đo wheel cho thấy cuộn gốc cập nhật ngay; cảm giác mượt được suy luận chủ yếu từ animation bám cuộn.
- **Đề xuất:** giữ theme Hoàng Long và cuộn gốc; thêm numeric GSAP scrub, header sticky thu gọn, word-mask dùng lại, rail tiến độ sáu chương, crossfade story có chiều sâu, bridge DENIS sticky, card/gallery/CTA motion và skeleton chạy một lần.
- **Animation/theme:** không đổi palette/font/type scale; chỉ đề xuất motion preset tập trung và surface header pha từ token hiện có. Mobile giảm pin/parallax; reduced motion/no-JS hiển thị tĩnh.
- **Trạng thái:** đề xuất, chờ người dùng xác nhận trước khi sửa component hoặc animation. HOME-002 vẫn là trạng thái đang chạy.
- **Kiểm chứng khảo sát:** mở và cuộn trang tham khảo ở 1440×900 và 390×844; chụp các mốc đầu/giữa/cuối, ghi nhận chiều cao trang khoảng 16.806 px trên mobile và không overflow ngang. Chưa triển khai hoặc test thay đổi trong project.

### HOME-002 — 2026-09-15 — Duyệt và triển khai landing storytelling

- **Nguồn xác nhận:** người dùng trả lời “tôi duyệt, hãy làm hiệu ứng xịn một tí nhé” sau kế hoạch HOME-001. Đã duyệt màn/component, display, GSAP/motion và bản đầu rút gọn khi thiếu ảnh DENIS/thông tin liên hệ.
- **Trước/sau:** `/` từ danh mục thành landing sáu chương; danh mục chuyển sang `/san-pham`, hỗ trợ `manufacturer=DENIS` và giữ bộ lọc khi tìm kiếm/phân trang.
- **Component:** LandingScreen, LandingHero, StoreStory/StoryChapter, DenisSpotlight, FeaturedDenisProducts, StoreGallery, ContactSection; dùng lại ScrollReveal, MediaFrame, ActionLink và ProductCard. Header liên kết section/route; Button và ActionLink chia sẻ styles. Page chỉ render screen.
- **Theme/motion:** giữ đỏ–trắng–than và Be Vietnam Pro; thêm display 44–96 px, màu chữ/viền trên nền tối tập trung. GSAP 3.15 và @gsap/react 2.1.2: hero reveal/parallax, story sticky/crossfade, DENIS reveal/parallax, stagger card/gallery/CTA. Preset tại `src/styles/motion.ts`; `matchMedia` và `useGSAP` cleanup khi đổi media/route; mobile bỏ sticky, reduced motion tắt hiệu ứng và smooth scroll.
- **Dữ liệu:** manufacturerService resolve tên chính xác qua phân trang; catalogService chỉ gọi products với đúng hãng. useProducts/useDenisProducts hủy request và chặn response cũ; query sai/thiếu hãng không rơi về danh mục không lọc. DTO dùng aliases từ OpenAPI. Không hardcode ID hãng.
- **Ảnh/nội dung:** dùng ảnh thật người dùng cung cấp, config tập trung. Khi chưa có ảnh sản phẩm, card dùng tên/mã/giá thật; không dựng bao bì DENIS. Chương kết dùng CTA danh mục, chưa công bố hotline/Zalo/địa chỉ/giờ mở cửa.
- **Kiểm chứng:** lint, typecheck, production build; 16 unit/hook tests, 7 Playwright tests đạt. Edge headless tại 360×800, 768×1024, 1440×900, 1440×600: không overflow ngang, chuyển ảnh theo chương, reduced motion/resize cleanup, search/page giữ hãng, quay về home và no-JavaScript. Đã xem screenshot desktop/mobile, story và DENIS/products. API thật từ trình duyệt trả HTTP 200, home hiển thị 6 sản phẩm đúng DENIS; E2E dùng mock để tái lập độc lập.
- **Giới hạn:** Computer Use native pipe không kết nối được, nên kiểm chứng bằng Edge headless; chưa kiểm tra Safari/thiết bị cảm ứng thật. Chờ ảnh DENIS và nội dung liên hệ xác nhận để bổ sung sau.
- **Trạng thái:** đã triển khai; cập nhật PROJECT.md, LANDING_PLAN.md, README và hướng dẫn tài nguyên. HOME-001 chuyển thành đã duyệt/triển khai; bổ sung animation trang trong phạm vi này thay quy tắc trang tĩnh của THEME-002.

### HOME-001 — 2026-09-15 — Khảo sát landing page storytelling cho Hoàng Long và DENIS

- **Phạm vi:** LANDING_PLAN.md, PROJECT.md và thư mục ảnh DENIS.
- **Trước:** / là màn danh mục với theme đã duyệt; chưa có kế hoạch landing page.
- **Sau:** đề xuất sáu chương giới thiệu shop/DENIS, chuyển danh mục sang /san-pham, danh sách component và animation GSAP theo cuộn.
- **Nguồn yêu cầu:** người dùng yêu cầu home landing page storytelling, giới thiệu cửa hàng và manufacturer Denis, rồi yêu cầu tiếp tục khảo sát.
- **Trạng thái quyết định:** mục tiêu đã được yêu cầu; storyboard, preset display, route phụ, CTA và animation cụ thể vẫn chờ xác nhận.
- **Triển khai:** hoàn thành khảo sát và kế hoạch; chưa thay UI hoặc cài thư viện.
- **Kiểm chứng:** đã xem 7 ảnh shop; GET manufacturers tìm đúng DENIS, GET products lọc hãng trả 7 sản phẩm, không sản phẩm nào có ảnh/mô tả; đã đối chiếu tài liệu GSAP/Motion/Lenis và kiểm tra Markdown.
- **Thông tin còn thiếu:** bài giới thiệu, liên hệ/giờ mở cửa, lựa chọn CTA; ảnh sản phẩm DENIS để bổ sung cho phần giới thiệu.
- **Thay thế:** chưa thay quy tắc không animation trang của THEME-001; hiệu ứng cuộn mới chỉ có hiệu lực sau khi HOME-001 được duyệt.

### THEME-002 — 2026-09-15 — Duyệt và áp dụng theme Hoàng Long

- **Phạm vi:** theme tokens, font local, BrandLogo, typography, UI/layout và màn danh mục / theo THEME-001.
- **Trước:** theme cam/Arial scaffold; kế hoạch theme đỏ đang chờ xác nhận.
- **Sau:** dùng đỏ #C90A00, nền sáng và chữ than; Be Vietnam Pro local 300–700, 9 preset chữ; control bo 8 px, card bo 12 px, spacing/shadow chung; logo gốc xuất hiện trong header/footer qua BrandLogo.
- **Animation:** màu nền/chữ/viền chuyển 150 ms ease-out; prefers-reduced-motion đặt thời lượng 0; focus hiện ngay; trang/card/logo không có animation.
- **Nguồn xác nhận:** người dùng trả lời "tôi đồng ý" sau khi được trình theme, danh sách component và animation trong phiên ngày 2026-09-15.
- **Trạng thái quyết định:** đã duyệt toàn bộ THEME-001 trong phạm vi được trình.
- **Triển khai:** hoàn tất; cập nhật hàm cn để nhận diện font-size semantic, tránh màu chữ làm mất cỡ chữ; giữ nguyên ảnh logo gốc, API/service/hook và nghiệp vụ.
- **Kiểm chứng:** lint, typecheck, 6 tests (gồm 2 regression tests cho ghép class typography), production build và Prettier; HTTP 200 cho trang chủ, logo và font local; CSS có 5 weight, màu brand, font-size semantic, transition .15s và reduced-motion 0s.
- **Giới hạn:** không có trình duyệt kết nối; chưa kiểm chứng trực quan 360/768/1440 px, keyboard hoặc animation thực tế; không kiểm thử tích hợp backend ở nhiệm vụ theme.
- **Thay thế:** THEME-001 chuyển từ đề xuất sang đã duyệt/triển khai; thay theme scaffold của SETUP-001 trong phạm vi style chung và màn /.

### THEME-001 — 2026-09-15 — Phân tích logo và đề xuất theme

- **Phạm vi:** THEME_PLAN.md, PROJECT.md và tài liệu tài nguyên.
- **Trước:** chưa nhận logo; theme cam/Arial là scaffold.
- **Sau:** đã xem Logo_Hoang_Long.jpg 1280 × 1280, lấy mẫu màu đỏ #C90A00; lập kế hoạch palette, font, typography, style, màn/component và animation.
- **Nguồn yêu cầu:** người dùng báo đã đặt logo và yêu cầu bắt đầu ngày 2026-09-15.
- **Trạng thái quyết định:** đề xuất của AI, chờ người dùng xác nhận THEME_PLAN.md; chưa phê duyệt theme hoặc animation.
- **Triển khai:** hoàn thành khảo sát và tài liệu kế hoạch; chưa sửa mã UI hoặc cài font.
- **Kiểm chứng:** xem ảnh, đo kích thước và lấy mẫu màu; đối chiếu metadata font chính thức; tính tỉ lệ tương phản các cặp màu chính; kiểm tra Markdown/liên kết. Chưa có UI mới để kiểm thử.
- **Thay thế:** cập nhật tình trạng nhận tài nguyên của BRAND-001; không thay thế theme scaffold trong code.

### BRAND-001 — 2026-09-15 — Chuẩn bị tài nguyên để thiết kế theme từ logo

- **Phạm vi:** public/images/shop/, PROJECT.md, CHANGELOG.md.
- **Trước:** chưa có thư mục nhận logo và ảnh giới thiệu shop.
- **Sau:** có thư mục logo/, introduction/ và hướng dẫn cung cấp ảnh, kèm phạm vi dự kiến thiết kế theme.
- **Lý do:** lấy logo shop làm cơ sở thiết kế font, cỡ chữ, font weight, màu và style dùng chung.
- **Nguồn xác nhận:** yêu cầu trực tiếp của người dùng ngày 2026-09-15 về folder ảnh và theme từ logo.
- **Trạng thái quyết định:** đã yêu cầu tạo thư mục và thiết kế theme từ logo; chưa có logo, chưa xác nhận kế hoạch chi tiết hoặc giá trị theme/animation.
- **Triển khai:** hoàn tất thư mục và tài liệu; phần thiết kế theme chờ tài nguyên và bước xác nhận theo workflow.
- **Kiểm chứng:** kiểm tra thư mục, đường dẫn tài liệu và định dạng Markdown; không đổi mã giao diện.
- **Thay thế:** không có; theme scaffold chưa được thay đổi.

### WF-001 — 2026-09-15 — Thiết lập quy trình AI cho frontend

- **Phạm vi:** AGENTS.md, PROJECT.md, CHANGELOG.md và liên kết README.
- **Trước:** chỉ có hướng dẫn tự sinh của Next.js trong AGENTS.md; thông tin setup nằm ở README; chưa có quy trình xác nhận thiết kế.
- **Sau:**
  - Phải hỏi người dùng khi chưa hiểu ý tưởng thiết kế.
  - Dùng wireframe Figma/Google Stitch AI để đọc thành phần/bố cục; không tự lấy style của wireframe.
  - Dùng theme, typography và component tập trung; không tạo style riêng trùng lặp.
  - Animation của màn hình/component cần người dùng xác nhận; wireframe không cung cấp thông tin animation.
  - Phải trình kế hoạch có danh sách màn hình và component để người dùng xác nhận trước khi tạo.
- **Lý do:** giữ đúng ý tưởng người dùng và thống nhất thiết kế trong toàn project.
- **Nguồn xác nhận:** yêu cầu trực tiếp của người dùng trong phiên làm việc ngày 2026-09-15 về AI workflow frontend.
- **Trạng thái quyết định:** đã xác nhận các quy tắc workflow; chưa xác nhận theme cụ thể, animation hay kế hoạch UI mới.
- **Triển khai:** đã thêm tài liệu workflow; giữ block Next.js tự sinh và giữ nguyên mã giao diện.
- **Kiểm chứng:** kiểm tra nội dung, liên kết nội bộ và định dạng Markdown trong nhiệm vụ tài liệu này; không chạy lại API/UI tests vì không đổi code.
- **Thay thế:** không có.

### SETUP-001 — 2026-09-15 — Scaffold frontend ban đầu

- **Phạm vi:** khởi tạo project, cấu trúc API/service/hook/component, Zustand, DTO và design tokens.
- **Trước:** chưa có project phu-tung-hoang-long-frontend.
- **Sau:** có Next.js TypeScript scaffold, màn danh mục mẫu và bộ UI/typography dùng lại.
- **Nguồn xác nhận:** yêu cầu khởi tạo project của người dùng trong phiên làm việc; kết quả triển khai ghi ở README.
- **Trạng thái quyết định:** kiến trúc đã được yêu cầu; màu cam, Arial/Helvetica, bố cục mẫu và transition màu là lựa chọn scaffold, chưa được duyệt làm thiết kế chính thức.
- **Triển khai:** hoàn tất scaffold; snapshot OpenAPI xuất từ bản build backend do endpoint cổng 3000 chưa kết nối được.
- **Kiểm chứng đã chạy ở lần setup:** lint, typecheck, 4 unit tests, production build, Prettier, HTTP 200 trang chủ, sinh DTO offline và giữ type khi đồng bộ HTTP lỗi.
- **Giới hạn:** chưa kiểm chứng trình duyệt và backend đang chạy; chưa có thiết kế/animation được xác nhận.
- **Thay thế:** không có.

## Mẫu bản ghi mới

```markdown
### <ID> — YYYY-MM-DD — <Nội dung thay đổi>

- Phạm vi: <màn/route, component, service/hook hoặc tài liệu>
- Trước: <hiện trạng>
- Sau: <thay đổi cụ thể>
- Lý do: <mục đích>
- Wireframe: <link + frame/section, hoặc không áp dụng>
- Theme/token: <dùng lại/thêm/sửa, hoặc không áp dụng>
- Animation: <hành vi hoặc không animation, nguồn xác nhận>
- Nguồn xác nhận: <yêu cầu/câu trả lời người dùng + ngày + phạm vi>
- Trạng thái quyết định: <đã xác nhận/chờ xác nhận>
- Triển khai: <chưa làm/đang làm/đã làm>
- Kiểm chứng: <đã chạy gì, kết quả, giới hạn>
- Thay thế: <ID quyết định cũ và phạm vi, hoặc không có>
```
