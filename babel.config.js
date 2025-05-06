/* eslint-env node */

//
// BABEL ESM SUPPORT
//
// While Babel supports ESM (i.e. this file could be babel.config.mjs using ESM import
//  statements and exporting a default configuration), when Babel uses MJS, it goes
//  async.
//
// Unfortunately, since we need to use Babel with ESLint (i.e. `@babel/eslint-parser`), and
//  ESLint [does not](https://github.com/babel/babel-loader/issues/894#issuecomment-791982579),
//  and [will not](https://github.com/eslint/eslint/discussions/14295), support async
//  parsers, we cannot use MJS with Babel.
//

const baseConfig = function () {
  return {
    presets: [
      // @see https://babeljs.io/docs/en/babel-preset-env#options
      ['@babel/preset-env', { targets: 'defaults' }],

      // @see https://babeljs.io/docs/en/babel-preset-react
      [
        '@babel/preset-react',
        {
          // use new React 16.14.0/17.0.0 JSX runtime
          runtime: 'automatic',
        },
      ],
    ],
  };
};

// overrides to base config for the 'build' env
const buildEnv = function () {
  return {
    // no point spending time transpiling code that doesn't matter
    ignore: [
      '**/__tests__', // This will ignore all test directories
      '**/__mocks__', // Ignore all Jest mocks
      '**/*.spec.js', // Should ignore individual test files
      '**/*.test.js', // Should ignore individual test files
    ],
  };
};

// overrides to the base config for the 'test' env
const testEnv = function () {
  return {
    // nothing specific for now
  };
};

module.exports = {
  // NOTE: VSCode and other IDEs will use whatever is in the root/base configuration
  //  since they don't know (at least not by default) about any specific env to use
  ...baseConfig(),

  // when BABEL_ENV='<name>', that environment is merge on top of the root/base config
  // @see https://babeljs.io/docs/en/options#env
  // @see https://babeljs.io/docs/en/options#merging
  env: {
    build: buildEnv(),

    // NOTE: it looks like Jest automatically sets BABEL_ENV=test (or maybe this
    //  keys off NODE_ENV=test, which Jest automatically sets to 'test', per
    //  https://jest-bot.github.io/jest/docs/babel.html); in any case, this is
    //  the config that Jest will work with
    test: testEnv(),
  },
};
