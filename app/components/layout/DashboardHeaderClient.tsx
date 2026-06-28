"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import logo from "@/fotos/Medipact Logo für Mediation Online.png";

type Props = {
  username: string;
  email: string;
};

export default function DashboardHeaderClient({ username, email }: Props) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/invites/me")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setPendingCount(Array.isArray(data) ? data.length : 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/me/role")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data?.is_admin) setIsAdmin(true); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = username.slice(0, 2).toUpperCase();

  const nav = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Neue Mediation", href: "/dashboard/mediation/new" },
    ...(isAdmin ? [{ label: "⚖ Workspace", href: "/workspace" }] : []),
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur-sm">
      <div className="container flex h-[73px] items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/dashboard" className="flex shrink-0 items-center gap-2.5">
          <Image
            src={logo}
            alt="medipact Logo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-lg object-cover"
            priority
          />
          <span className="text-lg font-black tracking-tight text-neutral-900">
            medipact
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {nav.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-neutral-100 text-neutral-900"
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: bell + user */}
        <div className="flex items-center gap-2">

          {/* Notification bell */}
          <Link
            href="/dashboard"
            title="Eingehende Einladungen"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            {pendingCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                {pendingCount > 9 ? "9+" : pendingCount}
              </span>
            )}
          </Link>

          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-neutral-100"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-600 text-sm font-bold text-white">
                {initials}
              </div>
              <span className="hidden max-w-[128px] truncate text-sm font-semibold text-neutral-900 sm:block">
                {username}
              </span>
              <svg
                className={`h-3.5 w-3.5 shrink-0 text-neutral-400 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg shadow-neutral-200/80">
                {/* User info */}
                <div className="flex items-center gap-3 border-b border-neutral-100 px-4 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-600 text-sm font-bold text-white">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-neutral-900">
                      {username}
                    </p>
                    <p className="truncate text-xs text-neutral-500">{email}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-1.5">
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/auth/login" })}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-red-50 hover:text-red-700"
                  >
                    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                    Ausloggen
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
