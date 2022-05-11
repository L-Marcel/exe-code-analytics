import { removeCommments } from "../util/removeComments";

class Counters {
  static getAll(text: string, withSpecialBlocks = false) {
    const content = removeCommments(text);
    return {
      lines: this.getLines(content),
      methods: this.getMethods(content, withSpecialBlocks),
      classes: this.getClasses(content)
    };
  };

  static getMethods(text: string, withSpecialBlocks = false) {
    //check in: regexr.com/6let0
    const blocks = text.match(/(?!(\n|=| ))(protected |abstract |private |public |static |async |function |final |native |synchronized |transient | )*[\S]* *([\S]|<([\s\w\d:,<>=\[\]\{\}])*>)* *\n*\([\s\w\d:,<>=\[\]\{\}.]*(\)[\s=>]*(?=(\{|:)))/g);
    const methods = withSpecialBlocks? blocks:this.removeSpecialBlocks((blocks? blocks:[]));
   
    return methods? methods:[]
  };

  static getClasses(text: string) {
    //check in: regexr.com/6lf47
    const classes = text.match(/(?!(\n| ))(protected |abstract |private |public |final | )*(class ([\S]{1,}) *)(extends ([\S]{1,}) *)?(implements *([\S]{1,} *(, *)?){1,})?(?=(\{|:))/g);
    return classes? classes:[];
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

export { Counters };
