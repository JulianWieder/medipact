import { NextResponse, type NextRequest } from "next/server";
import {
  LOGBUCH_APP_STORE_URL,
  LOGBUCH_PLAY_STORE_URL,
  LOGBUCH_WEB_URL,
} from "@/lib/logbuchApp";

/**
 * Ziel des App-QR-Codes (public/logbuch/qr-app.svg).
 * iPhone/iPad → App Store, Android → Google Play, sonst (oder solange ein
 * Store-Link fehlt) → Web-App. 302, weil sich die Ziele noch ändern.
 */
export function GET(req: NextRequest) {
  const ua = req.headers.get("user-agent") ?? "";
  let target = LOGBUCH_WEB_URL;
  if (/iPhone|iPad|iPod/i.test(ua) && LOGBUCH_APP_STORE_URL) target = LOGBUCH_APP_STORE_URL;
  else if (/Android/i.test(ua) && LOGBUCH_PLAY_STORE_URL) target = LOGBUCH_PLAY_STORE_URL;
  return NextResponse.redirect(target, 302);
}
