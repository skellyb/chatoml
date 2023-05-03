import { toml } from "./deps.ts";
import { findFile } from "./files.ts";
import { timestamp } from "./time.ts";
import { getChatCompletion } from "./api.ts";

/**
 * Send data to chat completion api.
 */
export async function sendChat(location?: string) {
  const filecheck = findFile(location);
  if (filecheck.isErr()) {
    console.error("no file found");
    return;
  }
  const filepath = filecheck.unwrap();
  console.log(`sending: ${filepath}`);
  const file = await Deno.readFile(filepath);
  const txt = new TextDecoder().decode(file);
  const body = toml.parse(txt);
  const res = await getChatCompletion(body);
  if (res.isOk()) {
    const data = res.unwrap();
    const content = data.choices[0]?.message?.content ?? "";
    const update = message("assistant", content);
    await Deno.writeTextFile(filepath, update, { append: true });
    console.log("sent");
  } else {
    console.error("Unable to respond:", res.unwrapErr());
  }
}

function message(role: string, content: string) {
  return `
# ${timestamp()}
[[messages]]
role = "${role}"
content = """${content}"""
`;
}
