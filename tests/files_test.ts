import { assert, assertEquals } from "./deps.ts";
import { findFile } from "../src/files.ts";

Deno.test("return latest chat file in current directory", () => {
  const filecheck = findFile();
  assert(filecheck.isOk());
  assertEquals(filecheck.unwrap(), "chat-20230501T000059.toml");
});

Deno.test("return chat file at location", () => {
  const filecheck = findFile("./chat-test.toml");
  assert(filecheck.isOk());
  assertEquals(filecheck.unwrap(), "chat-test.toml");
});

Deno.test("return recent chat file in directory", () => {
  const filecheck = findFile("./chats");
  assert(filecheck.isOk());
  assertEquals(filecheck.unwrap(), "chats/chat-20230502T153055.toml");
});

Deno.test("err if wrong type of file", () => {
  const filecheck = findFile("./files_test.ts");
  assert(filecheck.isErr());
  assertEquals(filecheck.unwrapErr(), "no file found");
});
