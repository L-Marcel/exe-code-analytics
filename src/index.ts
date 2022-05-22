const pckg = require("../package.json");

export function getVersion() {
  return pckg.version;
};

export * from "./providers/CodeAnalytic";
export * from "./providers/Complexity";
export * from "./providers/Scan";
export * from "./util/getUpdatedContentOfDiff";
export * from "./util/removeComments";

