import { Counters } from "./Counters";

export type File = {
  path: string;
  content: string;

  sloc?: number;
  complexity?: number;
  churn?: number;

  count?: {
    methods?: number;
    classes?: number;
  }
};

export type AnalyticOptions = {
  countMethodsWithSpecialBlocks: boolean;
};

class Analytic {
  private options: AnalyticOptions = {
    countMethodsWithSpecialBlocks: false
  };

  constructor(
    private files: File[], 
    options?: AnalyticOptions
  ) {
    this.options = {
      countMethodsWithSpecialBlocks: false,
      ...options
    };
  };
  
  execute() {
    const files = this.getChurn();

    console.warn("Complexity analytic is not avaliable!");

    return files.map(f => {
      const count = Counters.getAll(f.content, this.options.countMethodsWithSpecialBlocks);

      return {
        ...f,
        complexity: 0,
        sloc: count.lines,
        count: {
          methods: count.methods.length,
          classes: count.classes.length
        },
        content: f.content
      } as File;
    });
  };

  getChurn() {
    return this.files.reduce((prev, cur) => {
      const identicFileIndex = prev.findIndex(p => p.path === cur.path);

      if(identicFileIndex >= 0) {
        //Typescript problems
        let lastValue = prev[identicFileIndex].churn ?? 0;
        prev[identicFileIndex].churn = lastValue + 1;
      } else {
        prev.push(cur);
      };

      return prev;
    }, [] as File[]);
  };
};

export { Analytic };
