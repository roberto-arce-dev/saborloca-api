import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductorDto } from './dto/create-productor.dto';
import { UpdateProductorDto } from './dto/update-productor.dto';
import { Productor, ProductorDocument } from './schemas/productor.schema';

@Injectable()
export class ProductorService {
  constructor(
    @InjectModel(Productor.name) private productorModel: Model<ProductorDocument>,
  ) {}

  async create(createProductorDto: CreateProductorDto): Promise<Productor> {
    const nuevoProductor = await this.productorModel.create(createProductorDto);
    return nuevoProductor;
  }

  async findAll(): Promise<Productor[]> {
    const productors = await this.productorModel.find();
    return productors;
  }

  async findOne(id: string | number): Promise<Productor> {
    const productor = await this.productorModel.findById(id);
    if (!productor) {
      throw new NotFoundException(`Productor con ID ${id} no encontrado`);
    }
    return productor;
  }

  async update(id: string | number, updateProductorDto: UpdateProductorDto): Promise<Productor> {
    const productor = await this.productorModel.findByIdAndUpdate(id, updateProductorDto, { new: true });
    if (!productor) {
      throw new NotFoundException(`Productor con ID ${id} no encontrado`);
    }
    return productor;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.productorModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Productor con ID ${id} no encontrado`);
    }
  }
}
