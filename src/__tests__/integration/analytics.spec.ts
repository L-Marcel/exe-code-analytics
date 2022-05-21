import { Analytic } from "../../providers/Analytic";
import { Tests } from "../../providers/Tests";

const tests = new Tests();
const html = new Tests();

describe("Complexity", () => {
  beforeAll(async() => {
    await tests.getFilesToTest("javascript");
    await html.getFilesToTest("html");
  });

  it("Should be able to get churn", async() => {
    const file = await tests.get("if.ts");
    const file2 = await tests.get("if.ts");
    const file3 = await tests.get("if.ts");

    const analytics = new Analytic([file, file2, file3]);
    const result = analytics.getChurn();

    expect(result[0].churn).toEqual(0);
    expect(result[1].churn).toEqual(1);
    expect(result[2].churn).toEqual(2);
  });
});