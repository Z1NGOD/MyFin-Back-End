import { PartialType } from '@nestjs/swagger';
import { CreateExpenceDto } from './create-expence.dto';

export class UpdateExpenceDto extends PartialType(CreateExpenceDto) {}
