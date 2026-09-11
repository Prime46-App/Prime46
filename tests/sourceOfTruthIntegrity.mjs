import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));
const fail = (msg) => { throw new Error(msg); };
const pass = (msg) => console.log(`PASS: ${msg}`);

const required = [
  'PRIME_DEV_001_SYSTEM_PROMPT_v1.0.md',
  'PRODUCT_BIBLE.md',
  'SOURCE_OF_TRUTH_INDEX.md',
  'DECISION_LOG.md',
  'VESSEL_IMPLEMENTATION_SPEC_v1.0.md',
  'RECOMMENDATION_ENGINE_SPEC_v0.1.md',
  'CURRENT_ASSIGNMENT.json',
  'README.md',
  'tests/stateIntegrity.mjs',
  'tests/recommendation/acceptance.mjs',
  'tests/recommendation/playIntegration.mjs'
];

for (const file of required) {
  if (!exists(file)) fail(`Missing required source-of-truth file: ${file}`);
}
pass('required governing documents and test suites exist');

const assignmentFiles = fs.readdirSync(root)
  .filter((name) => /^PRIME_DEV_001_ASSIGNMENT_\d+\.md$/.test(name))
  .sort();
if (!assignmentFiles.length) fail('No human-readable assignment files found');

const assignments = assignmentFiles.map((file) => ({ file, text: read(file) }));
const authorized = assignments.filter(({ text }) => /^\*\*Status:\s*AUTHORIZED\*\*/mi.test(text));
const completed = assignments.filter(({ text }) => /^\*\*Status:\s*COMPLETE\*\*/mi.test(text));
if (authorized.length > 1) fail(`More than one AUTHORIZED assignment: ${authorized.map((a) => a.file).join(', ')}`);
if (completed.some(({ text }) => /Execution state:\s*NOT STARTED/i.test(text))) {
  fail('A COMPLETE assignment still declares NOT STARTED');
}
pass('assignment lifecycle has at most one AUTHORIZED assignment and completed work is not marked NOT STARTED');

const pointer = JSON.parse(read('CURRENT_ASSIGNMENT.json'));
if (pointer.status === 'AUTHORIZED') {
  if (authorized.length !== 1) fail('CURRENT_ASSIGNMENT says AUTHORIZED but exactly one assignment is not AUTHORIZED');
  if (!pointer.file || pointer.file !== authorized[0].file) fail('CURRENT_ASSIGNMENT does not match the AUTHORIZED assignment');
  if (!exists(pointer.file)) fail(`CURRENT_ASSIGNMENT target does not exist: ${pointer.file}`);
} else if (pointer.status === 'IDLE') {
  if (authorized.length !== 0) fail('CURRENT_ASSIGNMENT says IDLE while an assignment remains AUTHORIZED');
  if (pointer.file !== null || pointer.assignment !== null) fail('IDLE pointer must use null assignment and file');
} else {
  fail(`Unsupported CURRENT_ASSIGNMENT status: ${pointer.status}`);
}
pass('current-assignment pointer agrees with human-readable assignment state');

const decisionLog = read('DECISION_LOG.md');
const headingStatuses = [...decisionLog.matchAll(/^## .*?—\s*([A-Z]+)(?:\s*—|$)/gm)].map((m) => m[1]);
const allowedDecisionStatuses = new Set(['LOCKED', 'WORKING', 'OPEN', 'SUPERSEDED']);
const invalidStatuses = [...new Set(headingStatuses.filter((s) => !allowedDecisionStatuses.has(s)))];
if (invalidStatuses.length) fail(`Decision Log contains unsupported decision status headings: ${invalidStatuses.join(', ')}`);
pass('Decision Log status headings use approved vocabulary');

const index = read('SOURCE_OF_TRUTH_INDEX.md');
const bible = read('PRODUCT_BIBLE.md');
const linkedRepoFiles = new Set(
  [...`${index}\n${bible}`.matchAll(/`([^`]+\.(?:md|mjs|json))`/g)]
    .map((m) => m[1])
    .filter((p) => !p.includes('*'))
);
for (const file of linkedRepoFiles) {
  if (!exists(file)) fail(`Referenced repository file does not resolve: ${file}`);
}
pass('Product Bible and Source-of-Truth Index repository-file links resolve');

const expectedCommands = [
  'node tests/sourceOfTruthIntegrity.mjs',
  'node tests/stateIntegrity.mjs',
  'node tests/recommendation/acceptance.mjs',
  'node tests/recommendation/playIntegration.mjs'
];
for (const command of expectedCommands) {
  if (!index.includes(command) && !read('README.md').includes(command)) fail(`Missing referenced test command: ${command}`);
}
const productionUrl = 'https://prime46.murphinsystems.workers.dev';
if (!index.includes(productionUrl) || !bible.includes(productionUrl)) fail('Production URL missing from governing source-of-truth documents');
pass('test commands and production URL are discoverable');

if (!bible.includes('LOCKED') || !bible.includes('WORKING') || !bible.includes('OPEN') || !bible.includes('SUPERSEDED')) {
  fail('Product Bible does not preserve all decision-status categories');
}
pass('Product Bible visibly preserves LOCKED / WORKING / OPEN / SUPERSEDED boundaries');

console.log(`SOURCE-OF-TRUTH INTEGRITY: PASS (${required.length} required files, ${assignmentFiles.length} assignments)`);
