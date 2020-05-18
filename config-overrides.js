const { override, fixBabelImports, addWebpackAlias, addDecoratorsLegacy, disableEsLint } = require('customize-cra');
const path = require('path')
const webpack = require('webpack')
const paths = require('react-scripts/config/paths');

paths.appBuild = path.resolve(__dirname, 'static-build/get-model-static')

const addCustom = () => config => {
    let plugins = [
        new webpack.ProvidePlugin({
            Util: 'Util'
        })
    ]

    config.plugins = [...config.plugins, ...plugins]

    return config
}

module.exports = override(
    addDecoratorsLegacy(),
    disableEsLint(),
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        // style: 'css',
    }),
    addWebpackAlias({        
        "@": path.resolve(__dirname, "src"),
        'Util': path.resolve(__dirname, 'src/asset/util.js')
    }),
    addCustom()
);
