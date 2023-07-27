import { AppError } from "./app-error";

export class BadInput extends AppError {
  message = this.originalError
}