import { assertEquals } from "https://deno.land/std@0.185.0/testing/asserts.ts";
import { stub } from "https://deno.land/std@0.185.0/testing/mock.ts";
import { FakeTime } from "https://deno.land/std@0.185.0/testing/time.ts";
import { api } from "../src/api.ts";
import { sendChat } from "../src/send.ts";
import { ChatCompletionResponseMessageRoleEnum, Ok } from "../src/deps.ts";

Deno.test("sendChat should parse chat file, send data to api, and write the response to file", async () => {
  const time = new FakeTime(new Date("February 20, 2020 20:20:20"));
  const openAiApiStub = stub(
    api,
    "getChatCompletion",
    // deno-lint-ignore require-await
    async () => {
      return Ok({
        id: "0001",
        object: "mock",
        created: 0,
        model: "mock-gpt",
        choices: [{
          message: {
            role: ChatCompletionResponseMessageRoleEnum.Assistant,
            content: "mock response",
          },
        }],
      });
    },
  );
  const temp = tempFile(`model = "gpt-3.5-turbo"

[[messages]]
role = "system"
content = "testing assistant"

# 20200221T011515
[[messages]]
role = "user"
content = """mock message"""
`);

  try {
    await sendChat(temp.path);
    const file = Deno.readFileSync(temp.path);
    const modified = new TextDecoder().decode(file);
    assertEquals(
      modified,
      `model = "gpt-3.5-turbo"

[[messages]]
role = "system"
content = "testing assistant"

# 20200221T011515
[[messages]]
role = "user"
content = """mock message"""

# 20200221T012020
[[messages]]
role = "assistant"
content = """mock response"""
`,
    );
  } finally {
    openAiApiStub.restore();
    time.restore();
    temp.remove();
  }
});

function tempFile(txt: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(txt);
  const filepath = Deno.makeTempFileSync({ suffix: ".toml" });
  Deno.writeFileSync(filepath, data);
  return {
    path: filepath,
    remove() {
      Deno.removeSync(filepath);
    },
  };
}
