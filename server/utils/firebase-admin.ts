import { initializeApp, getApps, cert } from "firebase-admin/app";

export function initializeFirebaseAdmin() {
  const apps = getApps();

  if (!apps.length) {
    initializeApp({
      credential: cert({
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
        projectId: process.env.FIREBASE_PROJECT_ID,
      }),
    });
  }

  return apps[0] || getApps()[0];
}
