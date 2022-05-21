import { Scan } from "./Scan";

interface AnalyticFile {
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
};

class Analytic<T> {
  constructor(
    private files: (AnalyticFile & T)[]
  ) {};

  fileIsValid(path: string) {
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
      const isValid = this.fileIsValid(f.path);
      const count = isValid? Scan.getAll(f.content):Scan.getBasic(f.content);

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
        content: f.content
      } as AnalyticFile & T;
    });
  };

  getChurn() {
    return this.files.reduce((prev, cur) => {
      const copies = prev.filter(p => p.path === cur.path);

      cur.churn = copies.length;
      prev.push(cur);

      return prev;
    }, [] as (AnalyticFile & T)[]);
  };
};

export {
  Analytic,
  AnalyticFile
};

