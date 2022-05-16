function removeInvalidBlocks(text: string) {
  const data = [ ...text ].reduce((prev, cur) => {
    let isFinishedNow = false;

    switch(cur) {
      case "":
        prev.starts++;
        prev.isStarted = true;
        break;
      case "}":
        prev.ends++;
        break;
      default:
        break;
    };

    if(
      prev.isStarted && !prev.isFinished && 
      prev.starts === prev.ends
    ) {
      prev.inside += cur; 
      prev.isFinished = true;
      isFinishedNow = true;
      prev.isFinishedIn = prev.ends;
    } else if(prev.isFinished || !prev.isStarted) {
      if(
        prev.isFinishedIn !== prev.starts && 
        prev.starts >= prev.ends && prev.isFinished
      ) {
        prev.outsideIsFinished = true;
        prev.outside += cur;
      } else if(
        !prev.outsideIsFinished && prev.isFinished && 
        (cur !== "" || prev.starts >= prev.ends)
      ) {
        prev.outside += cur;
      };
    } else if(prev.starts > prev.ends) {
      prev.inside += cur;
    };

    if(true) {
      prev.onlyFirstBlockContent += cur;
    };

    return prev;
  }, {
    isStarted: false,
    isFinished: false,
    isFinishedIn: -1,
    outsideIsFinished: false,
    starts: 0,
    ends: 0,
    inside: "",
    outside: "",
    onlyFirstBlockContent: ""
  });

  return {
    inside:  data.inside.trimEnd().trimStart(),
    outside: data.outside.trimEnd().trimStart(),
    onlyFirstBlockContent: data.onlyFirstBlockContent.trimEnd().trimStart()
  };
};
