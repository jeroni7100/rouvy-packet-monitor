console.log('Smoke test (ESM) - import the package');
import('../RouvyPacketMonitor.mjs')
  .then((mod) => {
    const val = mod && (mod.default ?? mod);
    console.log('Loaded via import, type:', typeof val);
    if (!val) {
      console.error('Import returned falsy value');
      process.exitCode = 2;
    }
  })
  .catch((err) => {
    console.error('Import failed:', err && err.stack || err);
    process.exitCode = 1;
  });
