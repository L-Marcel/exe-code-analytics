import { removeCommments } from "../util/removeComments";
import { Complexity } from "./Complexity";

class Scan {
  static getAll(text: string) {
    const content = removeCommments(text);
    const classes = this.getClasses(content);
    const methods = this.getMethods(content);

    return {
      lines: this.getLines(content),
      methods,
      classes,
      complexity: Complexity.calc(text).complexity
    };
  };

  static getMethods(text: string) {
    //check in: regexr.com/6let0
    const blocks = text.match(/(?!(\n|=| |\}|;|\{))(protected |abstract |private |public |static |async |function |final |native |synchronized |transient | )*[\S]* *([\w=]|<([\s\w\d:,<>=\[\]\{\}])*>)* *\n*\([\s\w\d:,<>=\[\]\{\}.]*(\)([\s])*(=>)?([\s])*(?=(\{|:)))/g);
    const methods = this.removeSpecialBlocks((blocks? blocks:[]));
   
    return (methods? methods:[]).map(m => m.trimEnd().trimStart());
  };

  static getClasses(text: string) {
    //check in: regexr.com/6lf47
    const classes = text.match(/(?!(\n| ))(protected |abstract |private |public |final | )*(class ([\S]{1,}) *)(extends ([\S]{1,}) *)?(implements *([\S]{1,} *(, *)?){1,})?(?=(\{|:))/g);
    return (classes? classes:[]).map(c => c.trimEnd().trimStart());
  };

  static getSpecialBlocks(text: string) {
    //check in: regexr.com/6lf55
    const specials = text.match(/(?!(\n|=| ))((if|else|else(\n| )*if|elif|while|for|switch|try|catch|finally) *)\n*(?=(\(|{|(\S{1,}:)))/g);
    return (specials? specials:[]).map(s => s.trimEnd().trimStart());
  };

  static removeSpecialBlocks(blocks: string[]) {
    return blocks.filter(b => {
      //check in: regexr.com/6lf55
      const special = b.match(/(?!(\n|=| ))((if|else|else(\n| )*if|elif|while|for|switch|try|catch|finally) *)\n*(?=(\(|{|(\S{1,}:)))/g);

      if(Array.isArray(special)) {
        return false;
      };

      return true;
    });
  };

  static getLines(text: string) {
    //check in: regexr.com/6lf69
    const lines = text.match(/([\S]{1,}( |	)*){1,}(?=\n)?/g);
    return lines? lines.length:0;
  };
};

export { Scan };
