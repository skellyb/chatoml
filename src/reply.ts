import { findFile } from "./files.ts";
import { message } from "./content.ts";
import { sendChat } from "./send.ts";

/**
 * Append a user message to chat file, then send for response.
 */
export async function replyChat(
  apiKey: string,
  content?: string,
  location?: string,
) {
  if (!content) {
    console.error("no message provided");
    return;
  }
  const filecheck = findFile(location);
  if (filecheck.isErr()) {
    console.error("no file found");
    return;
  }
  const filepath = filecheck.unwrap();
  const update = message("user", content ?? "");
  await Deno.writeTextFile(filepath, update, { append: true });
  await sendChat(apiKey, filepath);
}
