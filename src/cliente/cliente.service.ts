import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente, ClienteDocument } from './schemas/cliente.schema';

@Injectable()
export class ClienteService {
  constructor(
    @InjectModel(Cliente.name) private clienteModel: Model<ClienteDocument>,
  ) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    const nuevoCliente = await this.clienteModel.create(createClienteDto);
    return nuevoCliente;
  }

  async findAll(): Promise<Cliente[]> {
    const clientes = await this.clienteModel.find().populate('usuario', 'nombre email');
    return clientes;
  }

  async findOne(id: string | number): Promise<Cliente> {
    const cliente = await this.clienteModel.findById(id).populate('usuario', 'nombre email');
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    return cliente;
  }

  async update(id: string | number, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    const cliente = await this.clienteModel.findByIdAndUpdate(id, updateClienteDto, { new: true }).populate('usuario', 'nombre email');
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    return cliente;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.clienteModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
  }
}
