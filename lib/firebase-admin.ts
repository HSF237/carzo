import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function parsePrivateKey(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  let key = raw.trim();
  // Strip a wrapping pair of quotes some dashboards store literally
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }
  // Env vars can store the key with literal "\n" escape sequences instead
  // of real newlines — normalize either form to real newlines.
  return key.includes("\\n") ? key.replace(/\\n/g, "\n") : key;
}

// Falls back to the known project ID in case the env var is unset/stale in
// a given deployment target — project IDs aren't secret (they're already
// shipped to the browser via NEXT_PUBLIC_FIREBASE_PROJECT_ID).
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "carzo-fa9f9";

const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert({
          projectId: PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: parsePrivateKey(process.env.FIREBASE_PRIVATE_KEY),
        }),
      });

export const adminDb = getFirestore(app);
