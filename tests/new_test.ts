import { assertEquals } from "https://deno.land/std@0.185.0/testing/asserts.ts";
import { newChat } from "../src/new.ts";
import { timestamp } from "../src/time.ts";

Deno.test("create new chat in current directory with timestamp filename", async (t) => {
  const ts = timestamp();
  const path = `chat-${ts}.toml`;
  await t.step("create file", () => {
    newChat("testing");
    const file = Deno.readFileSync(path);
    const txt = new TextDecoder().decode(file);
    assertEquals(
      txt,
      `model = "gpt-3.5-turbo"

[[messages]]
role = "system"
content = "you are helpful, concise expert in many things"


# ${ts}
[[messages]]
role = "user"
content = """testing"""
`,
    );
  });
  Deno.removeSync(path);
});

Deno.test("create new chat at location with default timestamped filename", async (t) => {
  const ts = timestamp();
  const path = `chats/chat-${ts}.toml`;
  await t.step("create file", () => {
    newChat("testing", "./chats");
    const file = Deno.readFileSync(path);
    const txt = new TextDecoder().decode(file);
    assertEquals(
      txt,
      `model = "gpt-3.5-turbo"

[[messages]]
role = "system"
content = "you are helpful, concise expert in many things"


# ${ts}
[[messages]]
role = "user"
content = """testing"""
`,
    );
  });
  Deno.removeSync(path);
});

Deno.test("create new chat at location with provided filename without a message", async (t) => {
  const path = `./chats/test-chat.toml`;
  await t.step("create file", () => {
    newChat(undefined, path);
    const file = Deno.readFileSync(path);
    const txt = new TextDecoder().decode(file);
    assertEquals(
      txt,
      `model = "gpt-3.5-turbo"

[[messages]]
role = "system"
content = "you are helpful, concise expert in many things"
`,
    );
  });
  Deno.removeSync(path);
});
