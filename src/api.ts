import { Configuration, Err, Ok, OpenAIApi, type Result, z } from "./deps.ts";

const CompletetionReqBodySchema = z.object({
  model: z.string(),
  temperature: z.number(),
  messages: z.array(z.object({
    role: z.enum(["system", "user", "assistant"]),
    content: z.string(),
  })),
});

type CompletetionReqBody = z.infer<typeof CompletetionReqBodySchema>;

export async function getChatCompletion(body: unknown) {
  const reqBody = validateReq(body);
  if (reqBody.isErr()) {
    return Err(reqBody.unwrapErr());
  }
  const configuration = new Configuration({
    apiKey: "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",
  });
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
