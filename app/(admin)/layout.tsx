import { getSession } from "@/lib/auth/auth";
import { AdminSidebar } from "./admin-sidebar";
import UnAuthorized from "@/components/unauthorized";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession()

  if(!session || session?.user.role !== "admin") {
    return (
      <UnAuthorized />
    )
  }
  return (
    <main className="flex min-h-screen w-full bg-[#1a1a1a] ">
      <div className="flex min-h-full w-full flex-[15%] bg">
        <AdminSidebar />
      </div>
      <div className="flex min-h-full w-full flex-[85%]">{children}</div>
    </main>
  );
}
