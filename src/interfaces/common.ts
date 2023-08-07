import { IGenericErrorMessage } from "./error";

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessage: IGenericErrorMessage[];
};

export type IGenericResponses<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
};
