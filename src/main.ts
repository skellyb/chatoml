import { Command } from "./deps.ts";
import { sendChat } from "./send.ts";
import { newChat } from "./new.ts";
import { replyChat } from "./reply.ts";
import { modelsList } from "./models.ts";

const newCmd = new Command()
  .arguments("[message:string]")
  .description("create a new chat file in current directory by default")
  .option(
    "-l, --location <path:string>",
    "directory or full filepath for new chat file",
  )
  .action(({ location }, message) => {
    newChat(message, location);
  });

const sendCmd = new Command()
  .description("send latest chat file in current directory by default")
  .option(
    "-l, --location <path:string>",
    "directory or full filepath of existing chat file",
  )
  .env(
    "OPENAI_API_KEY=<value:string>",
    "OpenAI API keys can be found at https://platform.openai.com/account/api-keys",
    { required: true },
  )
  .action(({ location, openaiApiKey }) => {
    sendChat(openaiApiKey, location);
  });

const replyCmd = new Command()
  .arguments("[message:string]")
  .description(
    "add message to existing chat file in current directory and send it",
  )
  .option(
    "-l, --location <path:string>",
    "directory or full filepath of existing chat file",
  )
  .env(
    "OPENAI_API_KEY=<value:string>",
    "OpenAI API keys can be found at https://platform.openai.com/account/api-keys",
    { required: true },
  )
  .action(({ location, openaiApiKey }, message) => {
    replyChat(openaiApiKey, message, location);
  });

const modelsCmd = new Command()
  .description(
    "list available models",
  )
  .env(
    "OPENAI_API_KEY=<value:string>",
    "OpenAI API keys can be found at https://platform.openai.com/account/api-keys",
    { required: true },
  )
  .action(({ openaiApiKey }) => {
    modelsList(openaiApiKey);
  });

await new Command()
  .name("ChaTOML")
  .description("TOML client for OpenAI Chat Completion API")
  .usage("<command> [options]")
  .command("new", newCmd)
  .command("send", sendCmd)
  .command("reply", replyCmd)
  .command("models", modelsCmd)
  .parse(Deno.args);
