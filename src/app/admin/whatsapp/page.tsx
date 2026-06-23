import { AdminLayout } from "@/components/AdminLayout";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import WhatsAppForm from "./WhatsAppForm";

export default async function WhatsAppAdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  // Obter número atual
  const adminUser = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id) }
  });

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display font-bold text-3xl text-slate-800 mb-6">WhatsApp do Suporte</h1>
        <p className="text-slate-600 mb-8">
          Configure o número do WhatsApp que receberá os comprovantes de pagamento de Pix dos usuários. 
          Quando o usuário fizer os palpites e confirmar o pagamento, ele será automaticamente redirecionado 
          para este número com uma mensagem pré-pronta.
        </p>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <WhatsAppForm initialPhone={adminUser?.phone || ""} />
        </div>
      </div>
    </AdminLayout>
  );
}
