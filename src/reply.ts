import { findFile } from "./files.ts";
import { message } from "./content.ts";
import { sendChat } from "./send.ts";

export async function replyChat(content?: string, location?: string) {
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
  await sendChat(filepath);
}
