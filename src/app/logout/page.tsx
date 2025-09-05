"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      {session?.user && (
        <p>Welcome, {session.user.name || session.user.email}</p>
      )}
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
