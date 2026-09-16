import { notFound } from "next/navigation";
import { adminModules } from "@/config/admin";
import { AdminModuleScreen } from "@/components/features/admin/admin-module-screen";
export default async function Page({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module } = await params;
  const config = adminModules.find((item) => item.key === module);
  if (!config) notFound();
  return <AdminModuleScreen key={config.key} module={config.key} />;
}
