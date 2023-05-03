import { Command, CommandGroup, string } from "./deps.ts";
import { sendChat } from "./send.ts";
import { newChat } from "./new.ts";
import { replyChat } from "./reply.ts";

const configCmd = new Command(
  "create a new config file with your OpenAI API key",
)
  .required(string, "key")
  .optional(string, "location", {
    flags: ["location", "l"],
    description: "path to file",
  });
const newCmd = new Command("create new chat file").optional(string, "message")
  .optional(
    string,
    "location",
    {
      flags: ["location", "l"],
      description: "path to file",
    },
  );
const sendCmd = new Command("send updated messages (latest file by default)")
  .optional(string, "location", {
    flags: ["location", "l"],
    description: "path to file",
  });
const replyCmd = new Command(
  "add message ongoing chat and send (latest file by default)",
)
  .required(
    string,
    "message",
  ).optional(string, "location", {
    flags: ["location", "l"],
    description: "path to file",
  });
const cmds = new CommandGroup("ChaTOML").subcommand("config", configCmd)
  .subcommand("new", newCmd).subcommand(
    "send",
    sendCmd,
  ).subcommand(
    "reply",
    replyCmd,
  );

type CmdMap = { [k: string]: (flags?: Record<string, string>) => void };
const subcommands: CmdMap = {
  config(flags) {
    // TODO: setup config command
  },
  new(flags) {
    newChat(flags?.message, flags?.location);
  },
  send(flags) {
    // TODO: find config creds, prompt if not found
    sendChat(flags?.location);
  },
  reply(flags) {
    replyChat(flags?.message, flags?.location);
  },
};

const input = cmds.run();

// TODO: find more type-safe way to handle this -- enum?
const [subcmd] = Object.keys(input);
subcommands[subcmd](input[subcmd]);
