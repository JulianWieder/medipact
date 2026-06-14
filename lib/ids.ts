/**
 * Bijektives Encoding für Mediation-IDs in URLs.
 * Verhindert, dass interne Datenbank-IDs (1, 2, 3…) direkt als URL sichtbar sind.
 * Kein kryptografischer Schutz — verhindert lediglich triviales Enumeration.
 *
 * Beispiel: encodeId(1) → "ab3m7kn", decodeId("ab3m7kn") → 1
 */

const SECRET = 0xa3f4c2b1
const ALPHA = "abcdefghjkmnpqrstuvwxyz23456789" // 31 Zeichen, keine mehrdeutigen (0/o, 1/l/i)
const BASE = ALPHA.length // 31
const MIN_LEN = 7

export function encodeId(id: number): string {
  // XOR mit SECRET damit kleine IDs wie 1, 2, 3 nicht triviale Hashes ergeben
  let n = (id ^ SECRET) >>> 0 // unsigned 32-bit
  let result = ""
  do {
    result = ALPHA[n % BASE] + result
    n = Math.floor(n / BASE)
  } while (n > 0)
  // Auf Mindestlänge auffüllen
  while (result.length < MIN_LEN) result = ALPHA[0] + result
  return result
}

export function decodeId(hash: string): number | null {
  if (!hash || !/^[abcdefghjkmnpqrstuvwxyz23456789]+$/.test(hash)) return null
  let n = 0
  for (const c of hash) {
    const idx = ALPHA.indexOf(c)
    if (idx === -1) return null
    n = n * BASE + idx
  }
  const id = ((n ^ SECRET) >>> 0)
  return id > 0 ? id : null
}

/**
 * Hilfsfunktion für Client-Komponenten, die mediationId (numerischer String)
 * für URL-Navigation in einen Hash umwandeln müssen.
 */
export function hashId(mediationId: string | number): string {
  return encodeId(Number(mediationId))
}
