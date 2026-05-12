"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/auth/login" })}
      className="btn btn-secondary text-sm"
    >
      Ausloggen
    </button>
  );
}
