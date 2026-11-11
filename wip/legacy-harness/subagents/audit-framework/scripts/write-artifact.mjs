import fs from 'node:fs/promises';
import path from 'node:path';
export async function writeArtifact(destination, data) {
  const output = path.resolve(destination);
  if (!output.endsWith('.json') || output.split(path.sep).some(x => ['.git','node_modules'].includes(x)) || ['package.json','package-lock.json','npm-shrinkwrap.json','tsconfig.json','jsconfig.json'].includes(path.basename(output))) throw new Error('Choose a dedicated JSON evidence/graph output path');
  if (typeof data.repository === 'string' && path.isAbsolute(data.repository)) {
    const relative = path.relative(path.resolve(data.repository), output);
    if (!relative || !path.isAbsolute(relative) && relative !== '..' && !relative.startsWith('..' + path.sep)) throw new Error('Raw assessment artifacts must stay outside the assessed repo; use the workDirectory returned by prepare-output.mjs');
  }
  let existing;
  try { existing = await fs.lstat(output); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  if (existing) {
    if (!existing.isFile() || existing.isSymbolicLink()) throw new Error('Artifact destination must be a regular file');
    let previous;
    try { previous = JSON.parse(await fs.readFile(output, 'utf8')); } catch { throw new Error('Refusing to replace a non-artifact output file'); }
    if (previous.schema !== data.schema) throw new Error('Refusing to replace a different artifact or application JSON');
  }
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, JSON.stringify(data, null, 2) + '\n');
}
