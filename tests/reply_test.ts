import { assertEquals, FakeTime, stub } from "./deps.ts";
import { api } from "../src/api.ts";
import { replyChat } from "../src/reply.ts";
import { tempFile } from "./utils.ts";
import { ChatCompletionResponseMessageRoleEnum, Ok } from "../src/deps.ts";

Deno.test("replyChat should parse chat file, add a user message, send data to api, and write the response to file", async () => {
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
            content: "mock response to reply",
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

# 20200221T011818
[[messages]]
role = "assistant"
content = """first mock response"""
`);

  try {
    await replyChat("reply", temp.path);
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

# 20200221T011818
[[messages]]
role = "assistant"
content = """first mock response"""

# 20200221T012020
[[messages]]
role = "user"
content = """reply"""

# 20200221T012020
[[messages]]
role = "assistant"
content = """mock response to reply"""
`,
    );
  } finally {
    openAiApiStub.restore();
    time.restore();
    temp.remove();
  }
});
