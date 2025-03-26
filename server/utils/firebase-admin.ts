import { initializeApp, getApps, cert } from "firebase-admin/app";

export function initializeFirebaseAdmin() {
  const apps = getApps();

  if (!apps.length) {
    initializeApp({
      credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS!),
    });
  }

  return apps[0] || getApps()[0];
}
