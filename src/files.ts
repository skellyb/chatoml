import { Err, None, Ok, type Option, path, type Result, Some } from "./deps.ts";

/**
 * Find a valid TOML filepath. If the location isn't provided, check for files
 * in the current directory with a pattern, like chat-20210930T135023.toml,
 * and return the most recent. If a location to directory is provided, return
 * the most recent chat file found there. If path the path is to a file,
 * check if exists and has a toml extension. If so return the provided path.
 */
export function findFile(location?: string): Result<string, string> {
  let cwd = ".";
  const file = getFileInfo(location);
  if (file.isSome() && location) {
    const fileInfo = file.unwrap();
    if (fileInfo.isDirectory) {
      cwd = location;
    } else if (fileInfo.isFile && location.endsWith(".toml")) {
      return Ok(path.join(location));
    } else {
      return Err("no file found");
    }
  }
  const files = [...Deno.readDirSync(cwd)];
  const chats = files.filter((f) =>
    f.isFile && f.name.match(/chat-\d{8}T\d{6}\.toml$/)
  ).map((f) => f.name).sort();
  const latest = chats.pop();
  if (latest) {
    return Ok(path.join(cwd, latest));
  }
  return Err("no file found");
}

/**
 * Returns FileInfo if it exists.
 */
export function getFileInfo(path?: string): Option<Deno.FileInfo> {
  if (path) {
    try {
      const info = Deno.statSync(path);
      return Some(info);
    } catch (_) {
      return None;
    }
  }
  return None;
}
