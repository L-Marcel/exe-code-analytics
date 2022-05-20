import { Scan } from "./Scan";

type AnalyticFile = {
  id?: string;
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

class Analytic {
  constructor(
    private files: AnalyticFile[]
  ) {};
  
  execute() {
    const files = this.getChurn();

    return files.map(f => {
      const count = Scan.getAll(f.content);

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
      } as AnalyticFile;
    });
  };

  getChurn() {
    return this.files.reduce((prev, cur) => {
      const identicFileIndex = prev.findIndex(p => p.path === cur.path);

      if(identicFileIndex >= 0) {
        let lastValue = prev[identicFileIndex].churn ?? 0;
        cur.churn = lastValue + 1;

        prev.push(cur);
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
  AnalyticFile
};

