# STACK-001 — Chuyển cảnh section xếp lớp

## Mục tiêu đã duyệt

Trên landing desktop, nội dung của cảnh hiện tại giữ nguyên vị trí khi cuộn. Cảnh kế tiếp đi từ dưới lên và phủ lên cảnh trước, tạo nhịp đọc theo từng chương.

Phương án layer ảnh ban đầu được thay thế bởi STORY-004: một `StoryStage` ghim trọn vùng kể chuyện; chữ bên trái và khung ảnh bên phải cùng giữ tại tâm section. Khi đổi chapter, chữ cũ đi 160 px lên trên và chữ mới từ 160 px bên dưới vào tâm để hai khối không chồng nhau; ba ảnh Store Story vẫn crossfade tại cùng một vị trí.

## Phạm vi triển khai

- Route `/`: `LandingScreen` bọc sáu chương bằng `StackedScenes`.
- Hero, sản phẩm DENIS và gallery được GSAP ScrollTrigger ghim cho đến khi section sau chạm đỉnh viewport.
- Store Story và DENIS tiếp tục dùng nhịp cuộn nội bộ hiện có; section sau vẫn phủ lên các section này.
- Store Story và gallery có nền `bg-surface` rõ ràng để cảnh mới che hoàn toàn cảnh trước.
- Back to top được đặt tại root layout, nên hoạt động nhất quán trên các route.

## Responsive và khả năng truy cập

- Chỉ kích hoạt stack tại `min-width: 1024px` và `min-height: 700px`.
- Mobile, viewport thấp và `prefers-reduced-motion: reduce` giữ luồng document bình thường; không pin hoặc scrub lớp ảnh.
- HTML tĩnh vẫn hiện đủ nội dung khi JavaScript bị tắt.

## Theme và motion

- Dùng lại palette, font, typography, bán kính và shadow hiện có; không thêm token thiết kế mới.
- Khoảng phủ giữa các section là `12svh`, shadow chỉ hỗ trợ nhận biết mặt phẳng.
- Ảnh Story dùng opacity crossfade thuần; không scale, dịch chuyển, xoay, perspective hoặc shadow layer.

## Kiểm chứng

- Đã xem trực quan desktop 1440 × 900 ở thời điểm Store Story phủ hero và chapter thứ ba.
- Lint, typecheck, 16 Vitest tests, production build và 10 Playwright tests đều đạt.
