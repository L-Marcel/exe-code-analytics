import { Analytic } from "../../providers/Analytic";
import { Tests } from "../../providers/Tests";

const tests = new Tests();

describe("Complexity", () => {
  beforeAll(async() => {
    await tests.getFilesToTest("javascript");
  });

  it("Should be able to get churn", async() => {
    const file = await tests.get("if.ts");
    const file2 = await tests.get("if.ts");

    const analytics = new Analytic([file, file2]);
    const result = analytics.getChurn();

    expect(result[0].churn).toEqual(1);
  });
});