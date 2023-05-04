import { timestamp } from "./time.ts";

export function message(role: string, content: string) {
  return `
# ${timestamp()}
[[messages]]
role = "${role}"
content = """${content}"""
`;
}
