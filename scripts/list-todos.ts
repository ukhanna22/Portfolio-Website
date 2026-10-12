/** Lists every remaining [TODO] placeholder in the content files. */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "content");
let count = 0;
for (const file of readdirSync(dir).filter((f) => f.endsWith(".ts") && f !== "todo.ts")) {
  readFileSync(join(dir, file), "utf8")
    .split("\n")
    .forEach((line, i) => {
      const m = line.match(/todo\("([^"]+)"\)/);
      if (m) {
        count++;
        console.log(`content/${file}:${i + 1}  ${m[1]}`);
      }
    });
}
console.log(`\n${count} placeholder${count === 1 ? "" : "s"} left.`);
