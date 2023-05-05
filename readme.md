`chatoml` uses [TOML](https://toml.io) files to work directly with OpenAI's Chat Completion API.

## Usage

```
Usage: ChaTOML <command> [options]

  Description:

    TOML client for OpenAI Chat Completion API

  Options:

    -h, --help  - Show this help.

  Commands:

    new     [message]  - create a new chat file in current directory by default
    send               - send latest chat file in current directory by default
    reply   [message]  - add message to existing chat file and send it
    models             - list available models

  Environment variables:

    OPENAI_API_KEY  <value>  - required for send, reply, and models commands
```

**Example:**
```
chatoml new "my first message" --location ~/Documents
```
