import { UseInterceptors } from '@nestjs/common';
import {
  SerializeInterceptor,
  type ClassContrustor,
} from '@common/interceptors';

export function Serialize(dto: ClassContrustor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
