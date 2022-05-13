//https://softwareengineering.stackexchange.com/questions/189222/are-exceptions-as-control-flow-considered-a-serious-antipattern-if-so-why/189225#189225
class Complexity {
  static count(text: string, initial = 1) {
    const { nodes } = this._calc(text, initial);
    return nodes;
  }; 

  static getBlockContent(text: string) {
    const { block } = this._getBlock(text);

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
     
        if(block.length > i) {
          prev += block[i];
        };
      };

      return prev;
    }, "");

    const { inside, outside, onlyFirstBlockContent } = this._removeInvalidBlocks(blockPiece);
    
    return {
      inside,
      outside,
      nodes: this._countSwitchCases(onlyFirstBlockContent)
    };
  };
  
  private static _calc(text: string, nodes = 0) {
    if(text !== '') {
      const { inside, outside, nodes: nodesInBlock,} = this.getBlockContent(text);
      nodes += nodesInBlock;

      if(inside !== '') {
        const { nodes: insideNodes } = this._calc(inside);
        nodes += insideNodes;
      };

      if(outside !== '') {
        const { nodes: outsideNodes } = this._calc(outside);
        nodes += outsideNodes;
      };

      return { 
        inside, 
        outside, 
        nodes: inside === '' && outside === ''? 0:nodes
      };
    };

    return { 
      inside: '',
      rest: '',
      nodes: 0
    };
  };

  private static _getBlock(text: string) {
    const block = text.match(/((else *\n*[\s]*)|((if|else(\n| )*if|elif|while|for|switch) *\n*(\(([\s\w\d:,!<>=\[\]\{\}.])*\))[\s]*))(?!{)/g);
    
    if(block) {
      return {
        block
      };
    };

    return {
      block: ""
    };
  };

  private static _countSwitchCases(text: string): number {
    const cases = text.match(/(	| |\n|\{){1,}(case|default( |\n)*:)(?![\w\d:,!<>=\[\]\{\}.])(\s*(\"|\`|\'))?/g);
    const breaks = text.match(/(	| |\n|{){1,}(break|return)(?![\w\d:,!<>=\[\]\{\}.])(\s*;)?/g);
    const count = Math.min(((cases? cases:[]).length, (breaks? breaks:[]).length));

    return count;
  };

  private static _getBlockValue(block: string, text: string): number {
    if(block.startsWith("if") || block.startsWith("elif") || block.match(/else(\n| )*if/)) {
      return 1;
    } else if(block.startsWith("switch")) {
      return this._countSwitchCases(text);
    };

    return 0;
  };

  private static _removeInvalidBlocks(text: string) {
    const data = [ ...text ].reduce((prev, cur, i) => {
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

      if(prev.isStarted && !prev.isFinished && prev.starts === prev.ends) {
        prev.inside += cur; 
        prev.isFinished = true;
        prev.isFinishedIn = prev.ends;
      } else if(prev.isFinished || !prev.isStarted) {
        if(prev.isFinishedIn !== prev.starts && prev.starts >= prev.ends && prev.isFinished) {
          prev.outsideIsFinished = true;
          prev.outside += cur;
        } else if(!prev.outsideIsFinished && (cur !== "}" || prev.starts >= prev.ends)) {
          prev.outside += cur;
        };
      } else if(prev.starts > prev.ends) {
        prev.inside += cur;
      };

      if((prev.starts === 1 || prev.starts === prev.ends || (prev.starts === prev.ends + 1 && cur !== "}")) && !prev.isFinished) {
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
