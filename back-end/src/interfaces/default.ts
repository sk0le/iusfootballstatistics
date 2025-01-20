export interface DefaultMessage<T> {
  status: string;
  message: string;
  data: T | null;
}
