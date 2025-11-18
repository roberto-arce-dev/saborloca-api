import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEntregaDto } from './dto/create-entrega.dto';
import { UpdateEntregaDto } from './dto/update-entrega.dto';
import { Entrega, EntregaDocument } from './schemas/entrega.schema';

@Injectable()
export class EntregaService {
  constructor(
    @InjectModel(Entrega.name) private entregaModel: Model<EntregaDocument>,
  ) {}

  async create(createEntregaDto: CreateEntregaDto): Promise<Entrega> {
    const nuevoEntrega = await this.entregaModel.create(createEntregaDto);
    return nuevoEntrega;
  }

  async findAll(): Promise<Entrega[]> {
    const entregas = await this.entregaModel.find();
    return entregas;
  }

  async findOne(id: string | number): Promise<Entrega> {
    const entrega = await this.entregaModel.findById(id)
    .populate('pedido', 'total estado fecha');
    if (!entrega) {
      throw new NotFoundException(`Entrega con ID ${id} no encontrado`);
    }
    return entrega;
  }

  async update(id: string | number, updateEntregaDto: UpdateEntregaDto): Promise<Entrega> {
    const entrega = await this.entregaModel.findByIdAndUpdate(id, updateEntregaDto, { new: true })
    .populate('pedido', 'total estado fecha');
    if (!entrega) {
      throw new NotFoundException(`Entrega con ID ${id} no encontrado`);
    }
    return entrega;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.entregaModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Entrega con ID ${id} no encontrado`);
    }
  }
}
