export type ComplexityCalcResult = {
  inside: string;
  outside: string;
  complexity: number;
};

class Complexity {
  static calc(text: string, initial = 1, isFirst = true): ComplexityCalcResult {
    let complexity = initial;

    if(text !== '') {
      const content = isFirst? this.removeStringsAndRegexsSpace(text):text;

      const { inside, outside, nodes: nodesInBlock } = this.getBlockContent(content);
      
      complexity += nodesInBlock;

      if(inside !== '') {
        const { complexity: insideNodes } = this.calc(inside, 0, false);
        complexity += insideNodes;
      };

      if(outside !== '') {
        const { complexity: outsideNodes } = this.calc(outside, 0, false);
        complexity += outsideNodes;
      };

      return { 
        inside, 
        outside, 
        complexity
      };
    };

    return { 
      inside: '',
      outside: '',
      complexity: 0
    };
  };

  static getBlockContent(text: string) {
    const { block } = this.getBlock(text);

    if(block === "") {
      return {
        inside: '',
        outside: '',
        nodes: 0
      };
    };

    const blockPieces = text.split(block[0]);

    const blockPiece = blockPieces.reduce((prev, cur, i) => {
      if(i > 0 || blockPieces.length === 1) {
        prev += cur;

        if(block.length > i && blockPieces.length - 1 > i) {
          prev += block[0];
        };
      };

      return prev;
    }, "");
    

    const { inside, outside, onlyFirstBlockContent } = this.removeInvalidBlocks(blockPiece);

    const nodes = this.getBlockValue(block[0].trimStart().trimEnd(), onlyFirstBlockContent);

    return {
      inside,
      outside,
      nodes 
    };
  };

  static getBlock(text: string) {
    const block = text.match(/(	| |\n|^|(?!\{)){1,}(if|elif|while|for|switch) *\n*\({1,}(?!{)/g);
    
    if(block) {
      return {
        block
      };
    };  

    return {
      block: ""
    };
  };

  static countSwitchCases(text: string): number {
    const { onlyFirstBlockContent } = this.removeInvalidBlocks(text);
    
    const cases = onlyFirstBlockContent.match(/(	| |\n|\{){1,}(case|default( |\n)*:)(?![\w\d:,!<>=\[\]\{\}.])(\s*(\"|\`|\'))?/g);
    const breaks = onlyFirstBlockContent.match(/(	| |\n|\{){1,}(break|return)(?![\w\d:,!<>=\[\]\{\}.])(\s*;)?/g);
    
    const count = Math.min(((cases? cases:[]).length, (breaks? breaks:[]).length));

    return count;
  };

  static getBlockValue(block: string, text: string): number {
    const isValid = text.includes("{") && text.includes("}");

    if((block.startsWith("if") || block.startsWith("elif")) && isValid) {
      return 1;
    } else if(block.startsWith("switch") && isValid) {
      return this.countSwitchCases(text);
    };

    return 0;
  };

  static removeStringsAndRegexsSpace(text: string) {
    const content = text.replace(/(\\\')|(\\\")|(\\\/)|(\\\`)|(\\\()|(\\\))|((\")( |[\d\w\S])*(\\\")*['`\/](\\\")*( |[\d\w\S])*(\"))|((\')( |[\d\w\S])*(\\\')*[`"\/](\\\')*( |[\d\w\S])*(\'))/g, "");
    const withOutGraveAccent = this.removeBlockOfStringSpace(content, "`");
    const withOutRegexBar = this.removeBlockOfStringSpace(withOutGraveAccent, "\/");
    const withOutDoubleQuotes = this.removeBlockOfStringSpace(withOutRegexBar, "\"");
    const withOutSingleQuote = this.removeBlockOfStringSpace(withOutDoubleQuotes, "'");

    return withOutSingleQuote;
  };

  static removeBlockOfStringSpace(text: string, key: string, secondaryKey?: string) {
    const data = [ ...text ].reduce((prev, cur) => {
      if(cur === key || (secondaryKey && cur === secondaryKey)) {
        prev.isInside = !prev.isInside;
        prev.result += cur;
        prev.rest = "";
      };

      if(!prev.isInside && cur !== key && cur !== secondaryKey) {
        prev.result += cur;
      } else if(prev.isInside && cur !== key && cur !== secondaryKey) {
        prev.rest += cur;
      };

      return prev;
    }, {
      result: "",
      rest: "",
      isInside: false
    });

    if(data.isInside) {
      data.result += data.rest;
    };

    return data.result;
  };

  static removeInvalidBlocks(text: string) {
    const data = [ ...text ].reduce((prev, cur) => {
      switch(cur) {
        case "{":
          prev.starts++;

          if(!prev.isStarted) {
            prev.matchFirstBlock = true;
          } else {
            prev.matchFirstBlock = false;
          };

          prev.isStarted = true;
          break;
        case "}":
          prev.ends++;
          prev.matchFirstBlock = true;
          break;
        default:
          break;
      };

      if(
        prev.matchFirstBlock &&
        cur !== "}" && !prev.isFinished
      ) {
        prev.onlyFirstBlockContent += cur;
      };

      if(
        prev.isStarted && !prev.isFinished && 
        prev.starts === prev.ends
      ) {
        prev.inside += cur; 
        prev.isFinished = true;
        prev.onlyFirstBlockContent += cur;
        prev.isFinishedIn = prev.ends;
      } else if(prev.isFinished || !prev.isStarted) {
        if(
          prev.isFinishedIn !== prev.starts && 
          prev.starts >= prev.ends && prev.isFinished
        ) {
          prev.outsideIsFinished = true;
          prev.outside += cur;
        } else if(
          !prev.outsideIsFinished && prev.isFinished && 
          (cur !== "}" || prev.starts >= prev.ends)
        ) {
          prev.outside += cur;
        };
      } else if(prev.starts > prev.ends) {
        prev.inside += cur;
      };

      return prev;
    }, {
      isStarted: false,
      isFinished: false,
      isFinishedIn: -1,
      matchFirstBlock: false,
      outsideIsFinished: false,
      starts: 0,
      ends: 0,
      inside: "",
      outside: "",
      onlyFirstBlockContent: ""
    });
    
    return {
      inside:  data.inside.trimEnd().trimStart(),
      outside: data.outside.trimEnd().trimStart(),
      onlyFirstBlockContent: data.onlyFirstBlockContent.trimEnd().trimStart()
    };
  };
};

export { Complexity };
