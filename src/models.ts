import { api } from "./api.ts";

/**
 * Log out a list of available models.
 */
export async function modelsList(apiKey: string) {
  const res = await api.getModels(apiKey);
  if (res.isOk()) {
    const { data } = res.unwrap();
    data.forEach((model) => console.log(model.id));
  } else {
    console.error("unable to respond:", res.unwrapErr());
  }
}
