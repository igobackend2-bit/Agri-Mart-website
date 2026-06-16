// ─────────────────────────────────────────────────────────────────────────────
// Lightweight session identity.
//
// The storefront needs a stable user id (uid) to key profiles + orders in
// Supabase. Previously this came from Firebase *anonymous* auth, which requires
// enabling the "Anonymous" provider in the Firebase console. To remove that
// setup dependency, we use a persistent local uid instead — and still honour a
// real Firebase session (e.g. Google sign-in) when one exists.
// ─────────────────────────────────────────────────────────────────────────────
import { auth } from './firebase';

const K_UID = 'igo_uid';
const K_SIGNED = 'igo_signed_in';

function makeId(): string {
  try {
    if (typeof crypto !== 'undefined' && (crypto as any).randomUUID) return 'u-' + (crypto as any).randomUUID();
  } catch { /* ignore */ }
  return 'u-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** Stable user id: a real Firebase uid if signed in via Google, else a local uid. */
export function currentUid(): string {
  const fb = auth.currentUser?.uid;
  if (fb) return fb;
  let id = '';
  try { id = localStorage.getItem(K_UID) || ''; } catch { /* ignore */ }
  if (!id) {
    id = makeId();
    try { localStorage.setItem(K_UID, id); } catch { /* ignore */ }
  }
  return id;
}

/** True if the customer has signed in (Firebase session OR our local session). */
export function isSignedIn(): boolean {
  if (auth.currentUser) return true;
  try { return localStorage.getItem(K_SIGNED) === '1'; } catch { return false; }
}

export function markSignedIn(): void {
  try { localStorage.setItem(K_SIGNED, '1'); } catch { /* ignore */ }
}

export function clearSession(): void {
  try { localStorage.removeItem(K_SIGNED); } catch { /* ignore */ }
}
