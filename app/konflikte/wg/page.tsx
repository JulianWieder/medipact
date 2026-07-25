import { permanentRedirect } from "next/navigation";

// WG & Mitbewohner wird seit 25.07.2026 nicht mehr als eigene Konfliktart
// angeboten (siehe backend/app/pricing.py). Die URL war indexiert und aus der
// Nav/Sitemap verlinkt — daher bleibt sie als 308-Redirect auf die Übersicht
// bestehen, statt in einen 404 zu laufen. Ziel bewusst /konflikte und nicht
// /konflikte/nachbarschaft: Google wertet Redirects auf thematisch nur halb
// passende Seiten als Soft-404.
export default function WgRedirect() {
  permanentRedirect("/konflikte");
}
