import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import EditBolaoForm from "./EditBolaoForm";
import { AdminLayout } from "@/components/AdminLayout";

export const dynamic = "force-dynamic";

export default async function EditBolaoPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const { id } = await params;

  const bolao = await prisma.bolao.findUnique({
    where: { id: parseInt(id, 10) }
  });

  if (!bolao) {
    redirect("/admin/dashboard");
  }

  return (
    <AdminLayout>
      <EditBolaoForm bolao={bolao} />
    </AdminLayout>
  );
}
