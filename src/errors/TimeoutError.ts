class TimeoutError extends Error {
  constructor(process: string) {
    super("Cann't finish process: " + process);
    this.name = "Timeout Error";
  };
};