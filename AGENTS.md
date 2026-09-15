# Workflow AI — Phụ Tùng Hoàng Long Frontend

## Phạm vi và tài liệu bắt buộc

Áp dụng cho project này và các thư mục con. Trao đổi bằng tiếng Việt, giữ identifier/code theo quy ước project. Tuân thủ chỉ dẫn hệ thống, môi trường và yêu cầu hiện tại của người dùng trước quy ước trong file này. Đọc thêm AGENTS.md ở thư mục con nếu có.

Khi bắt đầu nhiệm vụ:

1. Đọc [PROJECT.md](PROJECT.md) để hiểu kiến trúc, hiện trạng và những mục chưa được duyệt.
2. Đọc các bản ghi liên quan trong [CHANGELOG.md](CHANGELOG.md), kể cả quyết định đã bị thay thế.
3. Tra [README.md](README.md) khi cần chạy ứng dụng hoặc đồng bộ DTO.
4. Kiểm tra code, component, token và thay đổi sẵn có trước khi đề xuất hoặc sửa.

Không dùng trạng thái triển khai hoặc code có sẵn làm bằng chứng người dùng đã duyệt thiết kế. Không ghi đè công việc hay cấu hình riêng của người dùng.

## 1. Hiểu yêu cầu và hỏi điểm chưa rõ

- Khi nhận yêu cầu thiết kế frontend, nếu chưa hiểu ý tưởng, bố cục, nội dung, hành vi, phạm vi hoặc mục tiêu thiết kế, phải hỏi để người dùng xác nhận.
- Câu hỏi phải cụ thể, tập trung vào điểm ảnh hưởng đến kết quả. Có thể đưa lựa chọn/đề xuất nhưng phải ghi rõ đó là đề xuất.
- Không tự quyết các điểm còn mơ hồ, không coi im lặng là đồng ý.
- Có thể đọc tài liệu/code và khảo sát độc lập trong lúc chờ. Không tạo hoặc sửa giao diện phụ thuộc vào câu trả lời chưa có.
- Không hỏi lại nội dung đã được người dùng xác nhận và vẫn còn hiệu lực trong phạm vi đang làm.

## 2. Đọc wireframe Figma hoặc Google Stitch AI

Khi người dùng cung cấp link:

- Mở đúng link và frame/màn được chỉ định bằng công cụ phù hợp. Áp dụng hướng dẫn skill tương ứng nếu sử dụng Figma.
- Nếu không truy cập được, nói rõ giới hạn và yêu cầu thông tin cần thiết để đọc đúng wireframe; không đoán nội dung chưa xem.
- Chỉ lấy thông tin về thành phần thiết kế, bố cục, phân cấp nội dung, nhóm thông tin và luồng tương tác thể hiện trong wireframe.
- Không mặc nhiên sao chép style, màu, font, cỡ chữ, font weight, shadow hoặc hiệu ứng. Chỉ làm giống style wireframe khi người dùng yêu cầu rõ.
- Nếu được yêu cầu dùng style tham chiếu, vẫn ánh xạ vào theme/token/component chung; không tạo CSS rời rạc cho từng màn.
- Chỉ rõ phần có trong wireframe, phần đề xuất bổ sung và các trạng thái chưa được mô tả.
- Wireframe không có animation. Không suy diễn animation từ hình tĩnh hoặc coi việc duyệt wireframe là duyệt animation.

## 3. Lập kế hoạch để người dùng xác nhận trước khi tạo

Với yêu cầu tạo hoặc sửa giao diện, phải gửi kế hoạch cụ thể **trước khi tạo/sửa màn hình, component hoặc bản thiết kế**. Không bắt đầu code UI trong lúc chờ xác nhận.

Kế hoạch cần có:

1. Mục tiêu, phạm vi và nguồn wireframe nếu có.
2. Danh sách từng màn/route sẽ tạo hoặc sửa và mục đích của màn.
3. Danh sách component cho từng màn: tên, trách nhiệm, tạo mới/sửa/dùng lại, vị trí dự kiến.
4. Bố cục responsive và trạng thái cần có: loading, empty, error, success, disabled hoặc các trạng thái liên quan.
5. Theme/typography/token dùng lại; mọi token hoặc biến thể mới cần đề xuất.
6. Animation theo từng màn/component hoặc nhóm cùng hành vi; ghi rõ mục chưa xác nhận.
7. Dữ liệu/API, service/hook/state liên quan và tiêu chí kiểm chứng.
8. Các điểm cần người dùng xác nhận.

### Mẫu kế hoạch

**Mục tiêu:** ...

**Wireframe/tham chiếu:** ... hoặc không có.

| Màn/route | Tạo mới/sửa | Thành phần chính | Responsive và trạng thái |
| --------- | ----------- | ---------------- | ------------------------ |
| ...       | ...         | ...              | ...                      |

| Component | Màn sử dụng | Trách nhiệm | Tạo mới/sửa/dùng lại | Vị trí |
| --------- | ----------- | ----------- | -------------------- | ------ |
| ...       | ...         | ...         | ...                  | ...    |

**Theme:** token/preset dùng lại ..., đề xuất thêm/đổi ... hoặc không có.

| Màn/component | Animation đề xuất hoặc không animation | Trigger | Thời lượng/easing | Reduced motion | Trạng thái xác nhận               |
| ------------- | -------------------------------------- | ------- | ----------------- | -------------- | --------------------------------- |
| ...           | ...                                    | ...     | ...               | ...            | Chờ xác nhận/đã xác nhận theo ... |

**Dữ liệu và kiến trúc:** API ..., service ..., hook ..., state ...

**Kiểm chứng:** ...

**Cần xác nhận:** phạm vi màn/component, theme thay đổi, animation và các câu hỏi còn mở.

### Hiệu lực xác nhận

- Chờ phản hồi xác nhận rõ ràng trước khi triển khai phần phụ thuộc. Nếu chỉ được duyệt một phần, chỉ làm phần đã duyệt có thể tách độc lập.
- Xác nhận kế hoạch có thể đồng thời xác nhận animation nếu hành vi đã được mô tả rõ và không còn mục animation chờ quyết định. Không cần hỏi lại cùng nội dung.
- Nếu phát sinh màn/component mới, thay đổi style/theme hoặc animation ngoài kế hoạch đã duyệt, cập nhật phần kế hoạch thay đổi và chờ xác nhận trước khi làm phần đó.
- Người dùng có thể thay đổi quyết định; ghi rõ phạm vi thay thế trong changelog.
- Công việc chỉ đọc/review, sửa tài liệu hoặc sửa kỹ thuật không đổi giao diện/hành vi không cần tạo một kế hoạch màn hình giả để xin duyệt. Nếu phát hiện cần đổi UI, áp dụng quy trình xác nhận cho phần UI đó.
- Sau khi đã có xác nhận đầy đủ, tiếp tục thực hiện và kiểm chứng; không tạo thêm bước xin phép lặp lại.

## 4. Xác nhận animation

### Keyword `SCENE-STICKY`

- Khi người dùng ghi `SCENE-STICKY`, áp dụng hiệu ứng đã duyệt: trên desktop đủ kích thước, nội dung của section giữ ở giữa viewport trong một stage ghim; section kế tiếp đi từ dưới lên và phủ thay thế stage đó.
- Keyword là xác nhận sẵn cho animation này khi phạm vi screen/component đã rõ. Vẫn lập kế hoạch ngắn về screen, component, content, theme, responsive và kiểm chứng; chỉ cần hỏi lại khi có thay đổi ngoài hiệu ứng đã định nghĩa.
- Mobile, viewport thấp, Reduced Motion và no-JS phải giữ document flow bình thường. Tự kiểm tra vị trí đầu/giữa/cuối transition, sticky, nền và thứ tự lớp trước khi bàn giao.

- Mỗi màn/component trong kế hoạch phải được gắn hành vi animation đã xác nhận hoặc lựa chọn không animation đã xác nhận. Có thể gom nhóm để người dùng duyệt chung.
- Bao gồm animation xuất hiện/thoát, chuyển trang, hover/focus transition, expand/collapse, modal/drawer, skeleton shimmer và loading spinner.
- Không tự thêm hiệu ứng vì wireframe không thể hiện hoặc vì thư viện/component có mặc định.
- Với component dùng lại có hiệu ứng sẵn, nêu hiệu ứng trong kế hoạch. Chỉ cần dẫn lại xác nhận cũ nếu cùng hành vi và cùng phạm vi được duyệt.
- Hiệu ứng scaffold có sẵn không tự trở thành animation đã được duyệt. Không tự sửa hiện trạng ngoài nhiệm vụ; làm rõ khi dùng lại cho thiết kế mới.
- Khi đề xuất animation, mô tả thành phần, trigger, hiệu ứng, duration/easing và hành vi với prefers-reduced-motion.
- Sau khi được duyệt, dùng preset/token motion tập trung cho hành vi dùng lại; tránh mỗi component một thời lượng/easing tùy ý.

## 5. Dùng theme và component chung

- Nguồn màu/font/cỡ chữ/weight: [src/styles/tokens.css](src/styles/tokens.css).
- Preset typography: [src/styles/typography.ts](src/styles/typography.ts).
- Thành phần chữ: [src/components/ui/typography.tsx](src/components/ui/typography.tsx).
- Ưu tiên Title, Subtitle, Paragraph, Typography và các component UI/layout đã có.
- Không hardcode màu, font, cỡ chữ, weight riêng theo từng màn. Không tạo token/style gần trùng nhau để khớp từng chi tiết wireframe.
- Khi thiếu preset/token: kiểm tra khả năng dùng lại, giải thích nhu cầu trong kế hoạch, xin xác nhận rồi bổ sung tập trung.
- Nếu thay đổi component/token chung, kiểm tra các màn đang sử dụng để tránh làm lệch thiết kế khác.
- Theme hiện tại đã được người dùng duyệt theo [THEME_PLAN.md](THEME_PLAN.md): đỏ–trắng–than, Be Vietnam Pro và transition màu 150 ms có reduced motion. Dùng lại trong phạm vi đã duyệt; thay đổi theme hoặc thêm hành vi animation ngoài kế hoạch cần xác nhận mới.

## 6. Triển khai theo kế hoạch đã duyệt

- Page chỉ ghép/render screen; tách screen thành các component có trách nhiệm rõ ràng và có thể dùng lại.
- Component không trực tiếp gọi Axios; hook quản lý state/vòng đời request; service xử lý logic dữ liệu và gọi API config.
- Dùng DTO từ OpenAPI; không sửa generated types hoặc tự tạo hợp đồng backend để lấp chỗ chưa biết.
- Dùng Zustand cho state cần chia sẻ, giữ cơ chế store trong provider.
- Không mở rộng sang nghiệp vụ hoặc màn hình chưa được yêu cầu/xác nhận.
- Giữ semantic HTML, label, keyboard/focus, responsive và các trạng thái dữ liệu đã duyệt.
- Không ghi đè .env, in secret hoặc sửa project backend chỉ để làm frontend chạy nếu việc đó nằm ngoài nhiệm vụ.

## 7. Kiểm chứng và cập nhật tài liệu

- Đối chiếu kết quả với kế hoạch đã duyệt: đủ màn/component, đúng bố cục/thành phần wireframe, đúng theme chung và animation đã xác nhận.
- Chạy lint/typecheck/build và test phù hợp với thay đổi. Với UI, kiểm tra trình duyệt ở các kích thước liên quan, tương tác và trạng thái dữ liệu.
- **Tự kiểm tra giao diện là bước bắt buộc trước khi bàn giao mọi thay đổi UI.** Sau khi triển khai, phải mở/render giao diện thật hoặc ảnh chụp trình duyệt tại các viewport liên quan và đối chiếu từng yêu cầu đã được duyệt: nội dung được thêm/bỏ, bố cục, vị trí, khoảng cách, thứ tự lớp/overlap, responsive, trạng thái và animation. Phải sửa rồi kiểm tra lại nếu phát hiện khác yêu cầu; không đánh dấu hoàn tất chỉ dựa trên việc code, lint hoặc test tự động đạt.
- Với thay đổi animation/scroll, tự kiểm tra cả các điểm bắt đầu, giữa và kết thúc transition; xác nhận section/panel sticky, phần bị phủ và section thay thế có đúng thứ tự/lớp theo yêu cầu. Ghi viewport và kết quả tự kiểm tra trực quan vào CHANGELOG.md.
- Với animation, kiểm tra trigger, thời lượng và reduced motion theo kế hoạch.
- Không nói đã test API/trình duyệt khi chỉ đọc code, dùng mock hoặc dựa vào kết quả cũ. Ghi rõ backend/trình duyệt chưa truy cập được nếu bị chặn.
- Với nhiệm vụ chỉ sửa tài liệu, kiểm tra nội dung, liên kết và Markdown; không chạy test API/UI không liên quan.
- Cập nhật PROJECT.md khi trạng thái hoặc quy ước dự án thay đổi.
- Thêm bản ghi CHANGELOG.md cho quyết định/thay đổi, gồm nguồn xác nhận, màn/component, theme/animation bị ảnh hưởng, trạng thái triển khai và bằng chứng kiểm chứng.
- Giữ lịch sử cũ; đề xuất chưa được duyệt phải mang trạng thái chờ xác nhận.
- Bàn giao ngắn: đã làm gì, file/màn liên quan, kiểm tra nào đạt, giới hạn và các mục còn chờ. Không yêu cầu commit/deploy nếu người dùng chưa yêu cầu.

---

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
