#!/usr/bin/env node
import * as esbuild from 'esbuild';
import { parseArgs } from 'node:util';
import fs from 'fs';
import path from 'path';

const args = parseArgs({
  options: {
    watch: { type: 'boolean', short: 'w' }
  },
  allowPositionals: true
});

// Plugin to stub react-devtools-core
const stubDevtoolsPlugin = {
  name: 'stub-react-devtools',
  setup(build) {
    build.onResolve({ filter: /^react-devtools-core$/ }, args => ({
      path: args.path,
      namespace: 'stub-react-devtools',
    }));
    build.onLoad({ filter: /.*/, namespace: 'stub-react-devtools' }, () => ({
      contents: 'export default {};',
      loader: 'js',
    }));
  },
};

const buildOptions = {
  entryPoints: ['source/cli.tsx'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outdir: 'dist',
  format: 'cjs',
  banner: {
    js: `#!/usr/bin/env node`,
  },
  plugins: [stubDevtoolsPlugin],
  jsx: 'transform',
  loader: {
    '.tsx': 'tsx',
    '.ts': 'ts',
  },
  external: [],
};

async function copyFiles() {
  // Copy package.json to dist for proper module resolution
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const distPkg = {
    name: pkg.name,
    version: pkg.version,
    type: 'commonjs',
    bin: { 'mb-tui': './cli.js' },
    dependencies: pkg.dependencies,
  };
  fs.writeFileSync('dist/package.json', JSON.stringify(distPkg, null, 2));
}

if (args.values.watch) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  console.log('👀 Watching for changes...');
} else {
  await esbuild.build(buildOptions);
  await copyFiles();
  console.log('✓ Build complete: dist/cli.js');
}
