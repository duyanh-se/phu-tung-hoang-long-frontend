import { Card } from "./card";
import { Paragraph, Subtitle } from "./typography";

export function LoadingState() {
  return (
    <Card role="status">
      <Paragraph muted>Đang tải sản phẩm…</Paragraph>
    </Card>
  );
}
export function EmptyState() {
  return (
    <Card>
      <Subtitle>Chưa có sản phẩm</Subtitle>
      <Paragraph muted>Thử thay đổi từ khóa tìm kiếm.</Paragraph>
    </Card>
  );
}
