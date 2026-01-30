import Sidebar from "@/components/layout/Sidebar";

export default function AppLayout({
                                      children,
                                  }: {
    children: React.ReactNode;
}) {
    return (
        <main className="min-h-screen bg-[#f6f8fc]">
            <Sidebar />
            <div className="ml-[260px] p-8">{children}</div>
        </main>
    );
}
