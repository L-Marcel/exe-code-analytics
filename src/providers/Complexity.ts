//https://softwareengineering.stackexchange.com/questions/189222/are-exceptions-as-control-flow-considered-a-serious-antipattern-if-so-why/189225#189225

class Complexity {
  static calc(text: string, initial = 1) {
    let complexity = initial;

    if(text !== '') {
      //const content = this.removeStringsAndRegexsSpace(text);

      const { inside, outside, nodes: nodesInBlock } = this.getBlockContent(text);
      complexity += nodesInBlock;

      if(inside !== '') {
        const { complexity: insideNodes } = this.calc(inside, 0);
        complexity += insideNodes;
      };

      if(outside !== '') {
        const { complexity: outsideNodes } = this.calc(outside, 0);
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
      rest: '',
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
     
        if(block.length > i && blockPieces.length > 2) {
          prev += block[i];
        };
      };

      return prev;
    }, "");

    const { inside, outside, onlyFirstBlockContent } = this.removeInvalidBlocks(blockPiece);

    return {
      inside,
      outside,
      nodes: this.getBlockValue(block[0].trimStart().trimEnd(), onlyFirstBlockContent)
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
    const cases = text.match(/(	| |\n|\{){1,}(case|default( |\n)*:)(?![\w\d:,!<>=\[\]\{\}.])(\s*(\"|\`|\'))?/g);
    const breaks = text.match(/(	| |\n|\{){1,}(break|return)(?![\w\d:,!<>=\[\]\{\}.])(\s*;)?/g);
    const count = Math.min(((cases? cases:[]).length, (breaks? breaks:[]).length));

    return count;
  };

  static getBlockValue(block: string, text: string): number {
    if(block.startsWith("if") || block.startsWith("elif")) {
      return 1;
    } else if(block.startsWith("switch")) {
      return this.countSwitchCases(text);
    };

    return 0;
  };

  static removeStringsAndRegexsSpace(text: string) {
    const content = text.replace(/(\\\')|(\\\")|(\\\/)|(\\\`)|("( |.)*(\\\")*['`\/](\\\")*( |.)*")|(\/( |.)*(\\\\)*['"`](\\\\)*\/)|(\'( |.)*(\\\')*[`"\/](\\\')*\')/g, "");
    const withOutGraveAccent = this.removeBlockOfStringSpace(content, "`");
    const withOutRegexBar = this.removeBlockOfStringSpace(withOutGraveAccent, "\/");
    const withOutDoubleQuotes = this.removeBlockOfStringSpace(withOutRegexBar, "\"");
    const withOutSingleQuote = this.removeBlockOfStringSpace(withOutDoubleQuotes, "'");

    return withOutSingleQuote;
  };

  static removeBlockOfStringSpace(text: string, key: string) {
    const data = [ ...text ].reduce((prev, cur) => {
      if(cur === key) {
        prev.isInside = !prev.isInside;
        prev.result += cur;
        prev.rest = "";
      };

      if(!prev.isInside && cur !== key) {
        prev.result += cur;
      } else if(prev.isInside && cur !== key) {
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
      let isFinishedNow = false;

      switch(cur) {
        case "{":
          prev.starts++;
          prev.isStarted = true;
          break;
        case "}":
          prev.ends++;
          break;
        default:
          break;
      };

      if(
        prev.isStarted && !prev.isFinished && 
        prev.starts === prev.ends
      ) {
        prev.inside += cur; 
        prev.isFinished = true;
        isFinishedNow = true;
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

      if(
        prev.isStarted && (
        (prev.starts === 1 && cur !== "{") || 
        (prev.starts === prev.ends ||
        (prev.starts === prev.ends + 1 && cur !== "}")) &&
        (!prev.isFinished || isFinishedNow))
      ) {
        prev.onlyFirstBlockContent += cur;
      };

      return prev;
    }, {
      isStarted: false,
      isFinished: false,
      isFinishedIn: -1,
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
