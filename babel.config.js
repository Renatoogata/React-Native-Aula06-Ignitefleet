module.exports = function (api) {
  api.cache(true)
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          allowUndefined: false
        }
      ],
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            "@theme": "./src/theme",
            "@assets": "./src/assets",
            "@screens": "./src/screens",
            "@components": "./src/components",
            "@routes": "./src/routes",
            "@libs": "./src/libs",
            "@utils": "./src/utils"
          }
        }
      ]
    ]
  }
}
