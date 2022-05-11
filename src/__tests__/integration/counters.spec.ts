import { Counters } from "../../providers/Counters";

describe("Counters class", () => {
  it("Should be able to get methods in code", () => {
    const content = `import Joi from "joi";

    class ClassroomValidation {
      static create = Joi.object({
        title: Joi.string().required().min(3).max(40),
        subject: Joi.string().optional().min(3).max(20).allow(null, ''),
        description: Joi.string().optional().max(800).allow(null, '')
      }).required();
    
      static update = Joi.object({
        title: Joi.string().min(3).max(20),
        subject: Joi.string().min(3).max(18).allow(null, ''),
        description: Joi.string().max(800).allow(null, '')
      }).required().disallow({});

      test({ value = false }) {
        if(value) {
          return value;
        } else if(value === null) {
          ret
        };

        return null;
      };
    };
    
    export { ClassroomValidation };
    
    `;

    const { classes, methods, lines } = Counters.getAll(content);

    expect(classes.length).toEqual(1);
    expect(methods.length).toEqual(1);
    expect(lines).toEqual(22);
  });

  it("Should be able to get methods and special blocks in code", () => {
    const content = `@@ a line? @@
    import Joi from "joi";

    class ClassroomValidation {
      static create = Joi.object({
        title: Joi.string().required().min(3).max(40),
        subject: Joi.string().optional().min(3).max(20).allow(null, ''),
        description: Joi.string().optional().max(800).allow(null, '')
      }).required();
    
      static update = Joi.object({
        title: Joi.string().min(3).max(20),
        subject: Joi.string().min(3).max(18).allow(null, ''),
        description: Joi.string().max(800).allow(null, '')
      }).required().disallow({});

      test({ value = false }) {
        if(value) {
          return value;
        } else if(value === null) {
          ret
        };

        return null;
      };
    };
    
    export { ClassroomValidation };
    //Hum... this is a line? No!
    /* A LINE? NO! */
    #LINEEE? NO!
    <!-- LINE? NO! -->
function() {} () => {} () => {}
    `;

    const { classes, methods, lines } = Counters.getAll(content, true);

    expect(classes.length).toEqual(1);
    expect(methods.length).toEqual(6);
    expect(lines).toEqual(23);
  });

  it("Should be able to get methods of a void file", () => {
    const content = ``;

    const { classes, methods, lines } = Counters.getAll(content);
    const { classes: classes2, methods: methods2, lines: lines2 } = Counters.getAll(content, true);

    expect(classes.length).toEqual(0);
    expect(methods.length).toEqual(0);
    expect(lines).toEqual(0);

    expect(classes2.length).toEqual(0);
    expect(methods2.length).toEqual(0);
    expect(lines2).toEqual(0);
  });
});