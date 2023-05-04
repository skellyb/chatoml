import { timestamp } from "./time.ts";

/**
 * Format a new chat message.
 */
export function message(role: string, content: string) {
  return `
# ${timestamp()}
[[messages]]
role = "${role}"
content = """${content}"""
`;
}
