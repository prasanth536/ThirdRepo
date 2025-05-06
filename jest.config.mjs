//
// Generates a Jest Configuration
//

import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

/**
 * @returns {Object} The Jest configuration to use.
 */
const mkConfig = function () {
  const ignoredPaths = ['/node_modules/'];

  return {
    automock: false,
    verbose: true,

    testEnvironment: 'jsdom', // requires separate 'jest-environment-jsdom' package
    globals: {
      // NOTE: these must also be defined in <repo>/src/globals.d.ts (referenced in
      //  <repo>/tsconfig.json) and in <repo>/.eslintrc.js's `srcGlobals` object
      WP_BUILD_ENV: 'development',
    },
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
      '^.+\\.tsx?$': 'ts-jest',
      '.+\\.(png|jpg|jpeg|gif|svg|ttf|woff|woff2|otf)$': 'jest-transform-stub',
    },
    transformIgnorePatterns: [
      // whitelist specific packages under node_modules (the entirety of which
      //  is ignored by Jest by default) that are shipped as ES6-only and need
      //  to be transpiled via 'babel-jest' configured in the 'transform' option
      // @see https://github.com/facebook/jest/issues/9292#issuecomment-569673251
      'node_modules/(?!(' +
        'rtvjs' +
        // '|other-lib' +
        ')/)',
    ],

    // NOTE: paths are relative from where Jest is run
    collectCoverageFrom: [
      'src/**/[^.]*.{js,jsx,ts,tsx}', // ignore .files like .eslintrc.js with `/[^.]` in this glob pattern
    ],
    coverageDirectory: './coverage',
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },

    // NOTE: paths are ABSOLUTE, unless they begin with a globstar (**)
    testMatch: [
      // match any file with a suffix of .test, or .spec; and with .jsx? or .tsx?
      //  extensions; and just test.<ext> or spec.<ext>; as long as the file is inside
      //  a __test__ directory at any depth within the base path
      `${path.resolve(
        __dirname
      )}/src/**/__tests__/**/?(*.)+(spec|test).{js,jsx,ts,tsx}`,
    ],

    // NOTE: to truly ignore paths, we have to ignore them both for tests and
    //  coverage; just ignoring for tests will still result in those paths being
    //  loaded and transpiled for (unnecessary) coverage evaluation
    coveragePathIgnorePatterns: ignoredPaths,
    testPathIgnorePatterns: ignoredPaths,

    moduleDirectories: [
      'node_modules',

      // NOTE: This entry makes it possible for `*.spec.js` files to reference
      //  the `./testingUtility.js` module in the /tools/tests directory __without__
      //  using (potentially very long) relative directory paths, just as
      //  `import { render } from 'testingUtility'` because `__dirname` will
      //  always be the directory where this (jest.config.js) is located.
      // @see https://testing-library.com/docs/react-testing-library/setup#configuring-jest-with-test-utils
      //  for the configuration pattern.
      path.resolve(__dirname, './tools/tests'),
    ],

    // for aliases, also config eslint.config.mjs, webpack.config.mjs, and tsconfig.json
    moduleNameMapper: {
      '^testingUtility$': '<rootDir>/tools/tests/testingUtility.ts',
      '.+\\.(css|less|scss|sass|styl)$': 'identity-obj-proxy',
    },

    setupFilesAfterEnv: ['<rootDir>/tools/tests/jestSetup.js'],
    snapshotFormat: {
      escapeString: true,
      printBasicPrototype: true,
    },
  };
};

export default mkConfig();
