console.log('Smoke test (CJS) - require the package');
try {
  const pkg = require('..');
  console.log('Loaded via require, type:', typeof pkg);
  if (!pkg) {
    console.error('Require returned falsy value');
    process.exitCode = 2;
  }
} catch (err) {
  console.error('Require failed:', err && err.stack || err);
  process.exitCode = 1;
}
