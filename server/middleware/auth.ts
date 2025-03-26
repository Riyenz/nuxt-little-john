import { getAuth } from "firebase-admin/auth";
import { H3Event } from "h3";
import { initializeFirebaseAdmin } from "../utils/firebase-admin";

export default defineEventHandler(async (event: H3Event) => {
  initializeFirebaseAdmin();

  if (!event.path.startsWith("/api") || event.path.includes("/api/auth")) {
    return;
  }

  try {
    const authorization = getHeader(event, "Authorization");
    if (!authorization?.startsWith("Bearer ")) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized: No token provided",
      });
    }

    const token = authorization.split("Bearer ")[1];
    if (!token) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized: Invalid token format [001]",
      });
    }

    try {
      const decodedToken = await getAuth().verifyIdToken(token);

      event.context.auth = {
        uid: decodedToken.uid,
        email: decodedToken.email,
      };
    } catch (error) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized: Invalid token [002]",
      });
    }
  } catch (error: any) {
    if (!error.statusCode) {
      throw createError({
        statusCode: 500,
        message: error.message || "Internal server error",
      });
    }
    throw error;
  }
});
