import { UseInterceptors } from '@nestjs/common';
import {
  SerializeInterceptor,
  type ClassConstructor,
} from '@common/interceptors';

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
