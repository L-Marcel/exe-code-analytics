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
    const blocks = text.match(/(?!(\n|=| ))((protected |abstract |private |public |static |async |function |final |native |synchronized |transient | )?)*(([\S]?)* *)?([\S]? *)*\n*\(([\sA-z0-1_=<>&|$#/\\%\-_+^~?*!@"'`{},:.);[\]]?)*(\)([\sA-z0-1_=<>&|$#/\\%\-_+^~?*!@"'`,:.);[\]]?)*\{)/g);
    const methods = withSpecialBlocks? blocks:this.removeSpecialBlocks((blocks? blocks:[]));
   
    return (methods? methods:[]).map(m => m + " ... }");
  };

  static getClasses(text: string) {
    const classes = text.match(/(?!(\n| ))((protected |abstract |private |public |final | )?)*(class ([\S]*) *)(extends ([\S]*) *)?((implements *([\S]* *(, *)?)*)?)*\{/g);
    return (classes? classes:[]).map(m => m + " ... }");
  };

  static removeSpecialBlocks(blocks: string[]) {
    return blocks.filter(b => {
      const special = b.match(/(?!(\n|=| ))((if|else|else(\n| )*if|elif|while|for|switch|try|catch|finally) *)\n*(?=\()/g);

      if(Array.isArray(special)) {
        return false;
      };

      return true;
    });
  };

  static getLines(text: string) {
    const lines = text.match(/[\S]{1,}(?=\n)/g);
    return lines? lines.length+1:0;
  };
};

export { Counters };
