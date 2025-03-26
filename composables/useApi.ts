import { getCurrentUser } from "vuefire";
import type { NitroFetchRequest, NitroFetchOptions } from "nitropack";

type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

export async function useApi<T>(
  url: string,
  options: Omit<
    NitroFetchOptions<NitroFetchRequest, HttpMethod>,
    "headers"
  > = {}
) {
  const user = await getCurrentUser();

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "User not authenticated",
    });
  }

  const token = await user.getIdToken();

  return $fetch<T>(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
