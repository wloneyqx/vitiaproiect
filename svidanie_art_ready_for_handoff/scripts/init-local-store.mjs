import { mkdir, access } from "node:fs/promises";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");
const storePath = path.join(dataDir, "store.json");

await mkdir(dataDir, { recursive: true });

try {
  await access(storePath);
  console.log("Local store already exists.");
} catch {
  console.log("Local store will be created automatically on first app request.");
}
