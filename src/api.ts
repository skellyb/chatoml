import { Configuration, Err, Ok, OpenAIApi, type Result, z } from "./deps.ts";

const CompletetionReqBodySchema = z.object({
  model: z.string(),
  temperature: z.number().optional(),
  messages: z.array(z.object({
    role: z.enum(["system", "user", "assistant"]),
    content: z.string(),
  })),
});

type CompletetionReqBody = z.infer<typeof CompletetionReqBodySchema>;

// Exposed via const for easier mocking in tests.
export const api = { getChatCompletion, getModels };

/**
 * Validate parsed toml data then send to OpenAI Chat Completion API.
 */
async function getChatCompletion(body: unknown, apiKey: string) {
  const reqBody = validateReq(body);
  if (reqBody.isErr()) {
    return Err(reqBody.unwrapErr());
  }
  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);
  try {
    const res = await openai.createChatCompletion(reqBody.unwrap());
    if (res.status === 200 && res.data) {
      return Ok(res.data);
    } else {
      return Err(res.statusText);
    }
  } catch (err) {
    return Err(err.message as string);
  }
}

function validateReq(input: unknown): Result<CompletetionReqBody, string> {
  const parsed = CompletetionReqBodySchema.safeParse(input);
  if (parsed.success) {
    return Ok(parsed.data);
  }
  return Err(parsed.error.toString());
}

async function getModels(apiKey: string) {
  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);
  try {
    const res = await openai.listModels();
    if (res.status === 200 && res.data) {
      return Ok(res.data);
    } else {
      return Err(res.statusText);
    }
  } catch (err) {
    return Err(err.message as string);
  }
}
