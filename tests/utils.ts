export function tempFile(txt: string) {
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
