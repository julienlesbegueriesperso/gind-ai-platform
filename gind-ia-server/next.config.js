//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');
const path = require('path');
const { server } = require('typescript');


/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      "@langchain/openai",
      "langchain"
    ]
  },
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,

  },
  webpack: (config, { isServer }) => {
    
    if (!isServer) {
      // Fixes npm packages that depend on `fs` module
      config.resolve.fallback.fs = false;
      // Fix for pdf-parse issue with 'fs' module on client-side
      config.resolve.alias['fs'] = path.resolve(__dirname, './mocks/fs.js');
      // config.externals.push('@langchain/core/tools');
      // config.resolve.fullySpecified = false;
    }

    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });

    config.module.rules.push({
      test: /node_modules\/langchain/,
      resolve: {
        fullySpecified: false,
      },
    });


    return config;
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
