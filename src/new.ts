import { timestamp } from "./time.ts";
import { getFileInfo } from "./files.ts";
import { path } from "./deps.ts";

/**
 * Create a new chat file with an optional first message.
 */
export function newChat(message?: string, location?: string) {
  let filepath = `chat-${timestamp()}.toml`;
  const file = getFileInfo(location);
  if (file.isSome() && location) {
    const fileInfo = file.unwrap();
    if (fileInfo.isDirectory) {
      filepath = path.join(location, filepath);
    } else if (fileInfo.isFile) {
      console.error("file already exists:", location);
      return;
    } else {
      console.error("unable to create file here:", location);
      return;
    }
  } else if (location) {
    filepath = path.join(location);
  }
  let content = `model = "gpt-3.5-turbo"

[[messages]]
role = "system"
content = "you are helpful, concise expert in many things"
`;
  if (message) {
    content = `${content}

# ${timestamp()}
[[messages]]
role = "user"
content = """${message}"""
`;
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  Deno.writeFileSync(filepath, data);
}
