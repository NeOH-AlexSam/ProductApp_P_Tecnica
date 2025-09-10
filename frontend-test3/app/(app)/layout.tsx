import { TopMenu } from "@/components";
import { getUserFromToken } from "@/lib/getUserFromToken";

export default async function AppLayout({
 children
}: {
 children: React.ReactNode;
}) {
  const user = await getUserFromToken();

  return (
    <main className="min-h-screen">
      <TopMenu isAdmin={user?.isAdmin ?? false}></TopMenu>
      {children}
    </main>
  );
}