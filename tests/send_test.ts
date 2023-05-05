import { assertEquals, FakeTime, stub } from "./deps.ts";
import { ChatCompletionResponseMessageRoleEnum, Ok } from "../src/deps.ts";
import { api } from "../src/api.ts";
import { sendChat } from "../src/send.ts";
import { tempFile } from "./utils.ts";

Deno.test("sendChat should parse chat file, send data to api, and write the response to file", async () => {
  const time = new FakeTime(new Date(Date.UTC(2020, 1, 20, 20, 20, 20)));
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
    await sendChat("api-key", temp.path);
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

# 20200220T202020
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
