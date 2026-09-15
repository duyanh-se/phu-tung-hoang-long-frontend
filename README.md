# Phụ Tùng Hoàng Long — Frontend

Next.js App Router, TypeScript strict, Tailwind CSS 4, Axios và Zustand.

- `/`: landing page storytelling Hoàng Long / DENIS, dùng GSAP + ScrollTrigger, rail tiến độ desktop và cảnh sticky theo chương.
- `/san-pham`: tìm kiếm, phân trang và kiểu hiển thị danh mục.
- `/san-pham?manufacturer=DENIS`: danh mục lọc hãng; giữ hãng khi tìm kiếm/phân trang.

Ảnh/nội dung shop cấu hình tại `src/config/landing.ts`; theme tại `src/styles/tokens.css`, typography tại `src/styles/typography.ts`, nhịp animation tại `src/styles/motion.ts`. Chi tiết đã duyệt: [LANDING_PLAN.md](LANDING_PLAN.md), [MOTION_ENHANCEMENT_PLAN.md](MOTION_ENHANCEMENT_PLAN.md).

### Kiểm thử trình duyệt

`npm run test:e2e` chạy Playwright bằng Microsoft Edge headless, tự dùng server 3001 đang chạy hoặc khởi động dev server. Cần cài Microsoft Edge; có thể đổi `channel` trong `playwright.config.ts` theo môi trường CI. Các test mock API để không phụ thuộc database, kiểm tra responsive, cuộn/chuyển ảnh, reduced motion, query và điều hướng. Screenshot/trace nằm trong `test-results/` và được bỏ qua khỏi Git.

## Tài liệu dự án và AI workflow

- [PROJECT.md](PROJECT.md): thông tin dự án, kiến trúc và trạng thái thiết kế.
- [AGENTS.md](AGENTS.md): quy trình đọc wireframe, xác nhận kế hoạch màn/component, theme và animation trước khi triển khai giao diện.
- [CHANGELOG.md](CHANGELOG.md): lịch sử quyết định, thay đổi và kết quả kiểm chứng.

## Chạy local

Yêu cầu Node.js >= 22.16 và npm.

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Frontend: http://localhost:3001. Backend: http://localhost:3000/api/v1.
Backend cần cho phép origin http://localhost:3001 trong CORS_ORIGINS.

## Đồng bộ DTO từ Swagger

```powershell
npm run api:generate
npm run typecheck
```

- Swagger UI: http://localhost:3000/docs.
- JSON thực: http://localhost:3000/docs-json, đặt bằng OPENAPI_SCHEMA_URL trong .env.local.
- Script đọc env theo cơ chế Next.js; biến shell được ưu tiên.
- Sinh DTO, paths, operations vào src/types/generated/api.ts bằng openapi-typescript.
- Lưu schema tại openapi/schema.json. Commit schema và generated types cùng nhau; không sửa generated types bằng tay.
- Khi lỗi, script trả exit code khác 0 và giữ type cũ. Build/dev không cần backend đang chạy.

**Nguồn snapshot ban đầu:** endpoint localhost:3000 không truy cập được khi setup. Snapshot được xuất từ metadata controller/DTO trong bản build dist của phu-tung-hoang-long-backend cùng workspace. Không khởi động service hay database. Snapshot có thể cũ so với source backend; chạy api:generate khi backend hoạt động để đồng bộ chính thức.

Sinh lại từ snapshot đã lưu:

```powershell
npm run api:generate:local
```

Tiện ích bootstrap tùy chọn, cần backend có dist và node_modules:

```powershell
node scripts/export-backend-schema.mjs ../phu-tung-hoang-long-backend
npm run api:generate:local
```

Frontend thông thường không phụ thuộc source backend.

### Dùng DTO

```ts
import type { Dto, ProductQuery } from "@/types/api";
type CreateProductInput = Dto<"CreateProductDto">;
type Product = Dto<"ProductResponseDto">;
```

ProductQuery lấy từ query parameters của GET /api/v1/products. Ngày là ISO string; giá là decimal string | null theo backend. DTO kiểm tra lúc compile, không thay thế runtime validation.

## Cấu trúc

```text
openapi/schema.json             # snapshot API
scripts/                       # sinh types, xuất schema offline
src/
  app/                         # route, layout; page chỉ render screen
  api/
    api-config.ts              # Axios base URL, timeout, interceptor
    api-error.ts               # chuẩn hóa lỗi, giữ status/details
    endpoints.ts               # endpoint tương đối với baseURL
  components/
    ui/                        # Button, Input, Card, Typography, Pagination
    layout/                    # Container, SiteHeader, SiteFooter
    features/
      landing/                 # LandingScreen và sáu section storytelling
      products/                # Catalog, Toolbar, ProductCard
  config/                      # env, website config
  hooks/                       # data, loading, error, refetch, cancellation
  services/                    # gọi API, chuẩn hóa input/output, logic dữ liệu
  stores/                      # Zustand store factory
  providers/                   # store cho từng cây React
  styles/
    tokens.css                 # màu, font, cỡ chữ, weight, radius
    typography.ts              # title/subtitle/paragraph/caption
  types/
    generated/api.ts           # sinh tự động, không sửa tay
    api.ts                     # aliases DTO/query
  lib/                         # tiện ích dùng chung
```

Luồng: page → component → hook → service → api-config → backend.

- Component chỉ hiển thị/tương tác; không gọi Axios/service trực tiếp.
- Service không dùng React/Zustand; xử lý input/output với DTO.
- Hook quản lý state request, hủy khi unmount/thay query và bỏ qua response cũ.
- Zustand giữ state toàn cục (mẫu: kiểu hiển thị lưới/danh sách); data request nằm trong hook.
- Store tạo trong provider để tránh chia sẻ state giữa request SSR. Reload reset state; chưa bật persist.
- Chưa triển khai đăng nhập. Khi thêm auth, truyền bearer token theo request; không đặt token vào Axios defaults dùng chung ở server.
- Không fetch API bắt buộc trong build.

Luồng products có tìm kiếm, phân trang, loading, empty, error/thử lại và chuyển kiểu hiển thị. Không dùng sản phẩm giả khi backend chưa kết nối.

## Thêm feature

1. Đồng bộ Swagger, thêm aliases trong types/api.ts nếu cần.
2. Thêm endpoint vào api/endpoints.ts.
3. Tạo services/<feature>.service.ts dùng Axios config và DTO.
4. Tạo hooks/use-<feature>.ts quản lý data/loading/error.
5. Tạo components/features/<feature>/, dùng UI/layout chung.
6. page.tsx chỉ render screen.
7. Chỉ đưa vào Zustand state cần chia sẻ giữa nhiều component.

## Màu, font, typography

Sửa src/styles/tokens.css để đổi theme tập trung. Class semantic: bg-surface, text-foreground, text-muted, text-brand-700, border-border.

Theme đã duyệt: đỏ #C90A00, nền #FAFAF9, surface trắng, chữ #18181B. Font Be Vietnam Pro được lưu trong src/assets/fonts/be-vietnam-pro/ với 5 weight 300–700 và giấy phép OFL; src/config/fonts.ts dùng next/font/local. Build và trình duyệt không cần tải font từ Google.

Chi tiết theme và phạm vi được duyệt: [THEME_PLAN.md](THEME_PLAN.md). Preset: title, sectionTitle, subtitle, cardTitle, paragraph, label, button, caption, eyebrow. Mở rộng hệ chữ phải cập nhật cả tokens, typographyVariants và nhóm font-size trong src/lib/cn.ts.

Style chung: control cao tối thiểu 44 px/bo 8 px, card bo 12 px với shadow nhẹ, spacing theo nhịp 4 px. Dùng motion-interaction cho chuyển màu 150 ms ease-out; reduced motion tự đặt thời lượng về 0. Không thêm transition-all hoặc animation vào trang/card/logo.

```tsx
import { Title, Subtitle, Paragraph, Typography } from "@/components/ui/typography";

<Title>Danh mục phụ tùng</Title>
<Subtitle as="h2">Sản phẩm</Subtitle>
<Paragraph muted>Nội dung mô tả</Paragraph>
<Typography as="span" weight="bold">In đậm</Typography>
<Typography weight="light">Chữ nhẹ</Typography>
```

Weight: light, normal, medium, semibold, bold. Font cần hỗ trợ weight tương ứng. Mức heading HTML (as) độc lập với kiểu hiển thị (variant).

## Kiểm tra

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npm run format:check
```

npm run format định dạng code. npm run start chạy production cổng 3001 sau build.

### Kết quả setup

- Lint, TypeScript, 4 unit tests, production build và Prettier check đã đạt.
- HTTP smoke test trang chủ trả 200, có heading và ô tìm kiếm.
- Đã kiểm tra sinh type từ snapshot và việc giữ type cũ khi đồng bộ HTTP thất bại.
- Snapshot ban đầu gồm 16 paths và 26 schemas/DTOs.
- Chưa kiểm chứng API với backend đang chạy hoặc tương tác trình duyệt: backend cổng 3000 chưa kết nối được và phiên setup không có trình duyệt kết nối.

Tài liệu chính thức: [Next.js](https://nextjs.org/docs), [openapi-typescript](https://openapi-ts.dev/node), [Zustand với Next.js](https://zustand.docs.pmnd.rs/learn/guides/nextjs).
