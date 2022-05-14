const name = "first";

function getTest(name: string, expected?: Function) {
  switch (name) {
    case "first":
    case "last":
      return expected && expected(name);
    case "none":
      return true;
    default:
      break;
  };

  return false;
};

getTest(name);

export default null;