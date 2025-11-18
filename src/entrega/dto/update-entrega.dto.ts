import { PartialType } from '@nestjs/swagger';
import { CreateEntregaDto } from './create-entrega.dto';

export class UpdateEntregaDto extends PartialType(CreateEntregaDto) {}
