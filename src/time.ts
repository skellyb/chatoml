/**
 * Create a condensed UTC timestamp.
 */
export function timestamp() {
  const now = new Date();
  // from something like 2021-09-30T13:50:23.123Z to 20210930T135023
  return now.toISOString().replace(/[-:]|\.\d+Z$/g, "");
}
