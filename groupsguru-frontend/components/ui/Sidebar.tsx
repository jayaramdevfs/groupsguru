"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

interface SidebarProps {
  role: "ADMIN" | "STUDENT";
  isCollapsed: boolean;
  onToggle: () => void;
}

const studentLinks = [
  { name: "Dashboard", href: "/student/dashboard" },
  { name: "Categories", href: "/student/categories" },
  { name: "Study Materials", href: "/student/content" },
  { name: "Test Series", href: "/student/test-series" },
  { name: "Exams", href: "/student/exams" },
];

const adminSections = [
  {
    label: "CORE",
    links: [
      { name: "Dashboard", href: "/admin/dashboard" },
      { name: "Exam Categories", href: "/admin/content-tree" },
      { name: "Knowledge Assets", href: "/admin/study-materials" },
    ],
  },
  {
    label: "ASSESSMENT",
    links: [
      { name: "Question Forge", href: "/admin/questions" },
      { name: "Active Exams", href: "/admin/exams" },
      { name: "Intelligence", href: "/admin/intelligence" },
    ],
  },
  {
    label: "SYSTEM",
    links: [
      { name: "Access & Pricing", href: "/admin/pricing" },
      { name: "Engine Migration", href: "/admin/migration" },
    ],
  },
];

export function Sidebar({ role, isCollapsed }: SidebarProps) {
  const pathname = usePathname();

  const renderLink = (link: { name: string; href: string }) => {
    const isActive = pathname.startsWith(link.href);
    return (
      <Link
        key={link.name}
        href={link.href}
        className={`block px-4 py-2 text-[13px] font-medium rounded-[8px] transition-colors duration-150 ${
          isActive
            ? "text-[#E8E8E8] bg-[#2D2D2D] border-l-2 border-[#D97706] pl-3.5"
            : "text-[#A0A0A0] hover:text-[#E8E8E8] hover:bg-[#2D2D2D]"
        }`}
      >
        {link.name}
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
