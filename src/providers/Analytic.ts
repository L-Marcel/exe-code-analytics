import { Complexity } from "./Complexity";
import { Scan } from "./Scan";

type AnalyticFile = {
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

type AnalyticOptions = {
  countMethodsWithSpecialBlocks: boolean;
};

class Analytic {
  private options: AnalyticOptions = {
    countMethodsWithSpecialBlocks: false
  };

  constructor(
    private files: AnalyticFile[], 
    options?: AnalyticOptions
  ) {
    this.options = {
      countMethodsWithSpecialBlocks: false,
      ...options
    };
  };
  
  execute() {
    const files = this.getChurn();

    return files.map(f => {
      const count = Scan.getAll(f.content, this.options.countMethodsWithSpecialBlocks);

      return {
        ...f,
        complexity: Complexity.count(f.content),
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
      } as AnalyticFile;
    });
  };

  getChurn() {
    return this.files.reduce((prev, cur) => {
      const identicFileIndex = prev.findIndex(p => p.path === cur.path);

      if(identicFileIndex >= 0) {
        let lastValue = prev[identicFileIndex].churn ?? 0;
        prev[identicFileIndex].churn = lastValue + 1;
      } else {
        cur.churn = 0;
        prev.push(cur);
      };

      return prev;
    }, [] as AnalyticFile[]);
  };
};

export {
  Analytic,
  AnalyticOptions,
  AnalyticFile
};

