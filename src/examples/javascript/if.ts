const name = "first";

function getTest(name: string, expected?: Function) {
  if(name === "first" && expected) {
    if(expected(name)) {
      return true;
    };
  };

  return false;
};

getTest(name);

export default null;