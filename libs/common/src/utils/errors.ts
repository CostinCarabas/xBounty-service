import { QueryFailedError } from 'typeorm';
import axios from 'axios';

export class ErrorsUtils {
  static getError(error: unknown): string | unknown {
    if (!error) {
      return;
    }

    if (error instanceof QueryFailedError) {
      return {
        message: error.message,
        parameters: error.parameters,
        query: error.query,
      };
    }

    if (axios.isAxiosError(error)) {
      return {
        error: error.toString(),
        data: error.response?.data,
        baseUrl: error.config?.baseURL,
        url: error.config?.url,
      };
    }

    if (error instanceof Error) {
      return error?.toString();
    }
    return error;
  }

  static isNotFoundError(error: unknown): boolean {
    if (error instanceof Error) {
      return error.message === 'Request failed with status code 404';
    }
    return false;
  }

  static isBadRequestError(error: unknown): boolean {
    if (error instanceof Error) {
      return error.message === 'Request failed with status code 400';
    }
    return false;
  }

  static isForbiddenError(error: unknown): boolean {
    if (error instanceof Error) {
      return error.message === 'Request failed with status code 403';
    }
    return false;
  }

  static isDuplicateEntryError(error: unknown): boolean {
    return error instanceof QueryFailedError && error.driverError.code === 'ER_DUP_ENTRY';
  }
}
