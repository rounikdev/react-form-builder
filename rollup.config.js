import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import autoprefixer from 'autoprefixer';
import fs from 'fs';
import simpleVars from 'postcss-simple-vars';
import url from 'postcss-url';
import autoExternal from 'rollup-plugin-auto-external';
import cleaner from 'rollup-plugin-cleaner';
import copy from 'rollup-plugin-copy';
import dts from 'rollup-plugin-dts';
import externals from 'rollup-plugin-node-externals';
import postcss from 'rollup-plugin-postcss';
import renameNodeModules from 'rollup-plugin-rename-node-modules';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import visualizer from 'rollup-plugin-visualizer';

const sourceRoot = 'src';
const outputFolder = 'dist';
const typesOutputFolder = `${outputFolder}/dts`;

export default [
  // Build the package and the d.ts files:
  {
    input: [`${sourceRoot}/index.ts`],
    output: [
      { dir: `${outputFolder}/cjs`, format: 'cjs', sourcemap: false },
      {
        dir: outputFolder,
        format: 'esm',
        preserveModules: true,
        preserveModulesRoot: sourceRoot,
        sourcemap: false
      }
    ],
    plugins: [
      autoExternal(),
      cleaner({
        targets: [outputFolder]
      }),
      commonjs(),
      copy({
        targets: [
          {
            dest: outputFolder,
            src: ['CHANGELOG.md', 'package.json', 'README.md']
          }
        ]
      }),
      externals({ peerDeps: true }),
      json(),
      postcss({
        minimize: true,
        modules: true,
        plugins: [
          autoprefixer(),
          simpleVars(),
          url({
            url: 'inline'
          })
        ]
      }),
      renameNodeModules(),
      resolve(),
      terser(),
      typescript({
        tsconfig: 'tsconfig.build.json',
        useTsconfigDeclarationDir: true
      }),
      visualizer({
        filename: 'bundle-analysis.html'
      })
    ],
    external: ['react', 'react-dom', 'react-router', 'react-router-dom', 'typescript']
  },
  // Combine all d.ts files into
  // a single `index.d.ts` file:
  {
    input: `${typesOutputFolder}/index.d.ts`,
    output: [{ file: `${outputFolder}/index.d.ts`, format: 'es' }],
    plugins: [
      dts(),
      // After the build is ready
      // remove the separate d.ts files:
      {
        buildEnd() {
          fs.rmSync(typesOutputFolder, { force: true, recursive: true });
        }
      },
      // Use custom style inject function in order
      // to inject styles for each component once
      // no matter in how much chunks this
      // component is included:
      copy({
        targets: [
          {
            dest: `${outputFolder}/external/style-inject/dist`,
            src: ['style-inject.es.js']
          }
        ]
      })
    ]
  }
];
