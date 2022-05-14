const name = "first";

function getTest(name: string, expected?: Function) {
  if(name === "first") {
    return false;
  } else if(expected && expected(name)) {
    return true;
  };

  return false;
};

getTest(name);

export default null;