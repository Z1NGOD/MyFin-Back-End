import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomBadRequestException extends HttpException {
  constructor(message: string, errorCode: string) {
    super(
      {
        success: false,
        errorCode,
        message,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
