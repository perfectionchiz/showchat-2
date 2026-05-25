const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "tslib") {
    return context.resolveRequest(
      context,
      path.resolve(__dirname, "node_modules/tslib/tslib.es6.js"),
      platform,
    );
  }
  return context.resolveRequest(context, moduleName, platform);
};

config.resolver.unstable_conditionNames = [
  "browser",
  "require",
  "react-native",
];

module.exports = withNativeWind(config, {
  input: "./global.css",
});
