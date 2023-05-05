import { assertEquals, FakeTime } from "./deps.ts";
import { newChat } from "../src/new.ts";
import { timestamp } from "../src/time.ts";

Deno.test("create new chat in current directory with timestamp filename", () => {
  const time = new FakeTime(new Date("February 20, 2020 20:20:20"));
  const ts = timestamp(new Date());
  const path = `chat-${ts}.toml`;
  try {
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
  } finally {
    Deno.removeSync(path);
    time.restore();
  }
});

Deno.test("create new chat at location with default timestamped filename", () => {
  const time = new FakeTime(new Date("February 20, 2020 20:20:20"));
  const ts = timestamp(new Date());
  const path = `chats/chat-${ts}.toml`;
  try {
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
  } finally {
    Deno.removeSync(path);
    time.restore();
  }
});

Deno.test("create new chat at location with provided filename without a message", () => {
  const time = new FakeTime(new Date("February 20, 2020 20:20:20"));
  const path = `./chats/test-chat.toml`;
  try {
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
  } finally {
    Deno.removeSync(path);
    time.restore();
  }
});
