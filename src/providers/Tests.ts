import fs from "node:fs";

type FileType = "javascript";

class Tests {
  private files: string[] = [];
  private type: FileType = "javascript";

  async get(file: string) {
    const path = `${__dirname}/../examples/${this.type}/${file}`;
    const content = fs.readFileSync(path).toString();
    
    return {
      path: path.replace(`${__dirname}/../examples/`, ""),
      content
    };
  }; 

  async getFilesToTest(type: FileType = "javascript") {
    const dir = fs.readdirSync(`${__dirname}/../examples/${type}`);
    this.type = type;
    this.files = dir;

    return Promise.all(dir.map(async(f) => {
      const path = `${__dirname}/../examples/${type}/${f}`;
      const content = fs.readFileSync(path).toString();
      
      return {
        path: path.replace(`${__dirname}/../examples/`, ""),
        content
      };
    }));
  };
};
export { Tests };
