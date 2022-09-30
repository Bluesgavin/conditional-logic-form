import typescript from '@rollup/plugin-typescript';
import scss from 'rollup-plugin-scss';
export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    sourcemap: true,
    // file: 'bundle.js',
    format: 'umd',
    name: 'ConditionalLogic',
  },
  plugins: [
    typescript(),
    scss({
      output: 'dist/bundle.css',
      watch: 'src/styles/**/*.scss',
    }),
  ],
};

