import { getUpdatedContentOfDiff } from "../../util/getUpdatedContentOfDiff";

describe("Get updated content of diff", () => {
  it("Should be able to remove all old content", () => {
    const content = "@@ -4,10 +4,11 @@ //this is the file\n import { withUser } from \"../../../../../../utils/api/middlewares/withUser\"; /* an import */\n \n async function repositories(req: Req, res: Res) {\n   const { id } = req.query;\n+  const user = req.user;\n \n   const github = new Github(req, res);\n \n-  const repositories = await github.getAllRepositoriesByClassroomMembers(id?.toString());\n+  const repositories = await github.getAllRepositoriesByClassroomMembers(id?.toString(), user.id);\n \n   return res.status(200).json(repositories);\n };";
    const withoutDiff = getUpdatedContentOfDiff(content);
    expect(withoutDiff).not.toMatch(/^-.*/gm);
  });
});