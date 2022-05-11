function removeCommments(text: string) {
  return text.replace(/\/\*[\s\S]*?\*\/|\/\/.*|\#.*|\<\!\-\-.*.\-\-\>|^\@\@.*\@\@/g, "");
};

export { removeCommments };
