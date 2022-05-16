import { Complexity } from "../../providers/Complexity";
import { Tests } from "../../providers/Tests";

const tests = new Tests();

describe("Complexity", () => {
  beforeAll(async() => {
    await tests.getFilesToTest("javascript");
  });

  it("Should be able to replace string and regex in file content to calculate", () => {
    const content = Complexity.removeStringsAndRegexsSpace(`
      const helloMessage = "hello";
      const hello = \`say "\$\{helloMessage\}"\`;
      const helloRegex = /hello/g;
      const helloAgain = 'Hello!'';
      \"

      const matchedHello = hello.match(helloRegex) + \`\$\{helloAgain\}\`;
    `);

    expect(content).toEqual(`
      const helloMessage = "";
      const hello = \`\`;
      const helloRegex = //g;
      const helloAgain = ''';
      \"

      const matchedHello = hello.match(helloRegex) + \`\`;
    `);
  });

  it("Should be able to get complexity", async() => {
    const _if = await tests.get("if.ts");
    const _ifAnalytics = Complexity.calc(_if.content);
    expect(_ifAnalytics.complexity).toEqual(3);

    const _switch = await tests.get("switch.ts");
    const switchAnalytics = Complexity.calc(_switch.content);
    expect(switchAnalytics.complexity).toEqual(4);

    const small = await tests.get("small.ts");
    const smallAnalytics = Complexity.calc(small.content);
    expect(smallAnalytics.complexity).toEqual(10);


    const big = await tests.get("big.ts");
    const bigAnalytics = Complexity.calc(big.content);
    expect(bigAnalytics.complexity).toEqual(22);
  });

  it("Should be able to get if block", async() => {
    const file = await tests.get("if.ts");
    const analytics = Complexity.removeInvalidBlocks(file.content);

    expect(analytics.inside).toEqual('{\n' +
    '  if(name === "first" && expected) {\n' +
    '    if(expected(name)) {\n' +
    '      return true;\n' +
    '    };\n' +
    '  };\n\n' +
    '  return false;\n' +
    '}');

    expect(analytics.outside).toEqual(';\n' +
    '\ngetTest(name);' +
    '\n\nexport default null;');

    expect(analytics.onlyFirstBlockContent).toEqual('{\n' +
    '  if(name === "first" && expected) ;\n  ;\n' +
    '\n' +
    '  return false;\n' +
    '}');
  });

  it("Should be able to get switch block", async() => {
    const file = await tests.get("switch.ts");

    const analytics = Complexity.removeInvalidBlocks(file.content);
    
    expect(analytics.inside).toEqual('{\n' +
    '  switch (name) {\n' +
    '    case "first":\n' +
    '    case "last":\n' +
    '      return expected && expected(name);\n' +
    '    case "none":\n' +
    '      return true;\n' +
    '    default:\n' +
    '      break;\n' +
    '  };\n\n' +
    '  return false;\n' +
    '}');

    expect(analytics.outside).toEqual(';\n' +
    '\ngetTest(name);' +
    '\n\nexport default null;');

    expect(analytics.onlyFirstBlockContent).toEqual('{\n' +
    '  switch (name) ;' +
    '\n\n' +
    '  return false;\n' +
    '}');
  });

  it("Should be able to get else if block", async() => {
    const file = await tests.get("else-if.ts");

    const analytics = Complexity.removeInvalidBlocks(file.content);
    
    expect(analytics);

    expect(analytics.inside).toEqual('{\n' +  
    '  if(name === \"first\") {\n' +
    '    return false;\n' +
    '  } else if(expected && expected(name)) {\n' +
    '    return true;\n' +
    '  };\n\n' + 
    '  return false;\n' + 
    '}');

    expect(analytics.outside).toEqual(';\n' +
    '\ngetTest(name);' +
    '\n\nexport default null;');

    expect(analytics.onlyFirstBlockContent).toEqual('{\n' +
    '  if(name === "first")  else if(expected && expected(name)) ;\n' +
    '\n' +
    '  return false;\n' +
    '}');
  });
});