function getUpdatedContentOfDiff(text: string) {
  return text.replace(/^-.*/gm, "");
};

export { getUpdatedContentOfDiff };
