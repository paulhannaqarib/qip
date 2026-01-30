"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/nav";
import { cn } from "@/utils/cn";

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-[260px] bg-[#171a3b] text-white">
            {/* Brand */}
            <div className="px-6 pt-6">
                <div className="text-xl font-semibold leading-none">Qarib.ai</div>
                <div className="mt-2 text-xs text-white/60">Admin Portal</div>
            </div>

            <div className="mt-6 h-px bg-white/10" />

            {/* Navigation */}
            <nav className="px-3 py-4">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        const active =
                            item.href === "/"
                                ? pathname === "/"
                                : pathname.startsWith(item.href);

                        const Icon = item.icon;

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/80 transition",
                                        "hover:bg-white/10 hover:text-white",
                                        active && "bg-[#3aa3e3] text-white"
                                    )}
                                >
                                    <Icon size={18} />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 w-full p-4">
                <div className="rounded-2xl bg-[#121433] p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 font-semibold">
                            A
                        </div>
                        <div>
                            <div className="text-sm font-semibold">Admin User</div>
                            <div className="text-xs text-white/60">admin@qarib.ai</div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
