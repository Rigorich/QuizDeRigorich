module.exports = {
    
    mode: 'development',
    
    entry: "./src/index.tsx",
    
    output: {
        filename: "../../BackEnd/WebApp/wwwroot/main.js",
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