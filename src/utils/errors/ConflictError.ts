class ConflictError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.status = 409;
  }
}
export default ConflictError;
