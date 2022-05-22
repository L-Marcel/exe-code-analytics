import { Scan } from "./Scan";

type CodeAnalyticConfig = {
  printLog: "all" | "info" | "error" | "none";
};

interface CodeAnalyticFile {
  path: string;
  content: string;

  sloc?: number;
  complexity?: number;
  churn?: number;

  methods?: {
    count: number;
    all: string[];
  };

  classes?: {
    count: number;
    all: string[];
  };

  _analyticError?: string;
};

class CodeAnalytic<T> {
  private config: CodeAnalyticConfig = {
    printLog: "info"
  };

  constructor(
    private files: (CodeAnalyticFile & T)[] = [],
    config?: Partial<CodeAnalyticConfig>
  ) {
    this.config = {
      printLog: "info",
      ...config
    };
  };

  private canPrintInfo() {
    return this.config.printLog === "info" || this.config.printLog === "all";
  };

  private canPrintError() {
    return this.config.printLog === "error" || this.config.printLog === "all";
  };

  static fileIsValid(path: string) {
    if(!path.includes(".")) {
      return false;
    };

    const pathPieces = path.split(".");
    const mime = pathPieces[pathPieces.length - 1];

    switch(mime) {
      case "java":
      case "js":
      case "jsx":
      case "ts":
      case "tsx":
      case "txt":
      case "html":
      case "py":
        return true;
      default:
        return false;
    };
  };


  execute() {
    const files = this.getChurn();

    return files.map(f => {
      this.canPrintInfo() && console.log("\nStarting file scan: " + f.path);

      const isValid = CodeAnalytic.fileIsValid(f.path);
      const count = isValid? Scan.getAll(f.content):Scan.getBasic(f.content);

      (this.canPrintInfo() && !isValid) && console.warn("File is not fully supported: " + f.path);
      this.canPrintInfo() && console.info("File is loaded: " + f.path);

      return {
        ...f,
        complexity: count.complexity,
        sloc: count.lines,
        methods: {
          count: count.methods.length,
          all: count.methods
        },
        classes: {
          count: count.classes.length,
          all: count.classes
        },
        content: f.content,
        _analyticError: count._analyticError
      } as CodeAnalyticFile & T;
    });
  };

  getChurn() {
    return this.files.reduce((prev, cur) => {
      const copies = prev.filter(p => p.path === cur.path);

      cur.churn = copies.length;
      prev.push(cur);

      return prev;
    }, [] as (CodeAnalyticFile & T)[]);
  };
};

export {
  CodeAnalytic,
  CodeAnalyticConfig,
  CodeAnalyticFile
};

