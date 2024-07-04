import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomErrorCodes } from '@common/customErrorCodes/custom-error-codes';

export class UserAlreadyExistsException extends HttpException {
  constructor(message: string) {
    super(
      {
        success: false,
        errorCode: CustomErrorCodes.UserAlreadyExists,
        message,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
