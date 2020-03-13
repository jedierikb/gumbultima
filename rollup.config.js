import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';
import image from '@rollup/plugin-image';
import pkg from './package.json';

export default [
  {
    input: 'src/gumbultima.js',
    output: {
      file: pkg.main,
      format: 'esm'
    },
    plugins: [
      resolve(),
      babel({ 
        exclude: 'node_modules/**',
        presets: ['@babel/env', '@babel/preset-react']
      }),
      commonjs(),
      image(),
      minify()
    ],
    external: [
      'react',
      'react-dom',
      'prop-types',
      'styled-components',
      'lodash'
    ]
  },
];
