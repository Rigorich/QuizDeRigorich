module.exports = {
    
    mode: 'development',
    
    entry: "./src/index.tsx",
    
    output: {
        filename: "./dist/main.js",
    },
 
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
 
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" },
            { test: /\.js$/, loader: "source-map-loader" },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
        ]
    },
};