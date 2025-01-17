const webpack = require('webpack');
const ejs = require('ejs');
const EncodingPlugin = require('webpack-encoding-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ExtensionReloader = require('webpack-extension-reloader');
const { VueLoaderPlugin } = require('vue-loader');
const { version } = require('./package.json');

const config = {
    mode: process.env.NODE_ENV,
    context: __dirname + '/src',
    entry: {
        'background': './background.js',
        'content': './content/content.js',
        'courses-coloring': './content/modules/courses-coloring.js',
        'viewing-states': './content/modules/viewing-states.js',
        'user-courses': './content/modules/user-courses.js',
        'popupMenu/popupMenu': './popupMenu/popupMenu.js',
        'login/login': './login/login.js',
        'friendRequestsScreen/friendRequests': './friendRequestsScreen/friendRequests',
        'newProfilePic/newProfilePic': './newProfilePic/newProfilePic',
        'CoursesSchedulesLoader': './loaders/coursesSchedulesLoader.js',
        'manual/manual': './manual/manual'
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.js', '.vue']
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loaders: 'vue-loader',
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader'],
            },
            {
                test: /\.scss$/,
                use: ['vue-style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.sass$/,
                use: ['vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax'],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|ico)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: '/images/',
                    emitFile: false,
                },
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: '/fonts/',
                    emitFile: false,
                },
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            global: 'window',
        }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new CopyPlugin([
            { from: 'icons', to: 'icons' },
            { from: 'popupMenu/popupMenu.html', to: 'popupMenu/popupMenu.html', transform: transformHtml },
            { from: 'login/login.html', to: 'login/login.html', transform: transformHtml },
            { from: 'newProfilePic/newProfilePic.html', to: 'newProfilePic/newProfilePic.html', transform: transformHtml },
            { from: 'manual/manual.html', to: 'manual/manual.html', transform: transformHtml },
            { from: 'friendRequestsScreen/friendRequests.html', to: 'friendRequestsScreen/friendRequests.html', transform: transformHtml },
            {
                from: 'manifest.json',
                to: 'manifest.json',
                transform: (content) => {
                    const jsonContent = JSON.parse(content);
                    jsonContent.version = version;

                    if (config.mode === 'development') {
                        jsonContent['content_security_policy'] = "script-src 'self' 'unsafe-eval'; object-src 'self'";
                    }

                    return JSON.stringify(jsonContent, null, 2);
                },
            },
        ]),
    ],
};

if (config.mode === 'production') {
    config.plugins = (config.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"',
            },
        }),
    ]);
}

if (process.env.HMR === 'true') {
    config.plugins = (config.plugins || []).concat([
        new ExtensionReloader({
            manifest: __dirname + '/src/manifest.json',
        }),
    ]);
}

function transformHtml(content) {
    return ejs.render(content.toString(), {
        ...process.env,
    });
}

module.exports = config;