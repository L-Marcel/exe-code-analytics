import fs from "node:fs";

function writeLog(data: any, filename: string, operation: "write" | "append" = "write") {
  let mime = ".txt";
  let value = data;

  if(Array.isArray(data) || typeof data === "object") {
    value = JSON.stringify(data, null, 2);
    mime = ".json";
  } else if(typeof data !== "string" && typeof data !== "undefined") {
    value = data.toString();
  };

  const fsOperation = operation === "write"? fs.writeFileSync:fs.appendFileSync;

  fsOperation(`${process.cwd()}/src/__tests__/logs/${filename}.txt`, value);
};

export { writeLog };
