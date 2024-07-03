const path = require("path");
const typesAlias = require("./tsconfig.json").compilerOptions.paths;

module.exports = {
  jest: {
    preset: "ts-jest",
    configure: {
      moduleNameMapper: {
        ...typeAliases(),
      },
    },
  },
  plugins: [],
  webpack: {
    alias: typeAliases(),
    plugins: {
      remove: ["ModuleScopePlugin"],
    },
  },
};

function typeAliases() {
  const result = {};
  for (const ta in typesAlias) {
    result[ta] = path.resolve(__dirname, String(typesAlias[ta]));
  }
  return result;
}
