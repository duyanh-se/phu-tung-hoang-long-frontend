import type { AdminModule } from "@/services/admin.service";
export const adminModules: {
  key: AdminModule;
  label: string;
  description: string;
}[] = [
  {
    key: "products",
    label: "Sản phẩm",
    description: "Quản lý mã hàng, giá bán và danh mục sản phẩm.",
  },
  {
    key: "categories",
    label: "Danh mục",
    description: "Sắp xếp các nhóm phụ tùng trong cửa hàng.",
  },
  {
    key: "manufacturers",
    label: "Hãng sản xuất",
    description: "Quản lý các thương hiệu phân phối.",
  },
  {
    key: "contact-requests",
    label: "Yêu cầu liên hệ",
    description: "Tiếp nhận và theo dõi yêu cầu của khách hàng.",
  },
  {
    key: "users",
    label: "Người dùng",
    description: "Xem tài khoản và quản lý quyền truy cập.",
  },
];
export const contactStatuses = {
  NEW: "Mới",
  IN_PROGRESS: "Đang xử lý",
  RESOLVED: "Đã xử lý",
} as const;
