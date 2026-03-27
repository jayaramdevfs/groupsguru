"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { 
  Home, 
  Layers, 
  BookOpen, 
  ClipboardList, 
  FileText, 
  Network, 
  PenTool, 
  Cpu, 
  Wallet, 
  RefreshCw 
} from "lucide-react";

interface SidebarProps {
  role: "ADMIN" | "STUDENT";
  isCollapsed: boolean;
  onToggle: () => void;
}

const studentLinks = [
  { name: "Dashboard", href: "/student/dashboard", icon: Home },
  { name: "Categories", href: "/student/categories", icon: Layers },
  { name: "Study Materials", href: "/student/content", icon: BookOpen },
  { name: "Test Series", href: "/student/test-series", icon: ClipboardList },
  { name: "Exams", href: "/student/exams", icon: FileText },
];

const adminSections = [
  {
    label: "CORE",
    links: [
      { name: "Dashboard", href: "/admin/dashboard", icon: Home },
      { name: "Exam Categories", href: "/admin/content-tree", icon: Network },
      { name: "Knowledge Assets", href: "/admin/study-materials", icon: BookOpen },
    ],
  },
  {
    label: "ASSESSMENT",
    links: [
      { name: "Question Forge", href: "/admin/questions", icon: PenTool },
      { name: "Active Exams", href: "/admin/exams", icon: ClipboardList },
      { name: "Intelligence", href: "/admin/intelligence", icon: Cpu },
    ],
  },
  {
    label: "SYSTEM",
    links: [
      { name: "Access & Pricing", href: "/admin/pricing", icon: Wallet },
      { name: "Engine Migration", href: "/admin/migration", icon: RefreshCw },
    ],
  },
];

export function Sidebar({ role, isCollapsed }: SidebarProps) {
  const pathname = usePathname();

  const renderLink = (link: { name: string; href: string; icon: any }) => {
    const Icon = link.icon;
    const isActive = pathname.startsWith(link.href);
    return (
      <Link
        key={link.name}
        href={link.href}
        className={`flex items-center gap-3 px-4 py-2 text-[13px] font-medium rounded-[8px] transition-colors duration-150 ${
          isActive
            ? "text-[#E8E8E8] bg-[#2D2D2D] border-l-2 border-[#D97706] pl-3.5"
            : "text-[#A0A0A0] hover:text-[#E8E8E8] hover:bg-[#2D2D2D] group"
        }`}
      >
        <span className="flex-shrink-0">
          <Icon className={`w-[18px] h-[18px] transition-colors duration-150 ${isActive ? "text-[#D97706]" : "text-[#707070] group-hover:text-[#A0A0A0]"}`} />
        </span>
        <span>{link.name}</span>
      </Link>
    );
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 bg-[#1E1E1E] border-r border-[#3A3A3A] transition-all duration-200 ease-out overflow-hidden flex flex-col ${
        isCollapsed ? "w-0 opacity-0" : "w-[260px] opacity-100"
      }`}
    >
      {/* Header */}
      <div className="h-[48px] flex items-center px-5 border-b border-[#3A3A3A] flex-shrink-0">
        <Link
          href={role === "ADMIN" ? "/admin/dashboard" : "/student/dashboard"}
          className="flex-shrink-0"
        >
          <Logo size="sm" />
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-3 overflow-y-auto scrollbar-hide">
        {role === "ADMIN" ? (
          <nav className="space-y-5 px-3">
            {adminSections.map((section) => (
              <div key={section.label}>
                <div className="px-4 pb-1.5 text-[10px] font-semibold text-[#666666] uppercase tracking-widest">
                  {section.label}
                </div>
                <div className="space-y-0.5">
                  {section.links.map(renderLink)}
                </div>
              </div>
            ))}
          </nav>
        ) : (
          <nav className="space-y-0.5 px-3">
            {studentLinks.map(renderLink)}
          </nav>
        )}
      </div>
    </div>
  );
}
