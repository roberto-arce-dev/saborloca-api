import { PartialType } from '@nestjs/swagger';
import { CreateProductorDto } from './create-productor.dto';

export class UpdateProductorDto extends PartialType(CreateProductorDto) {}
