import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto, ProductoDocument } from './schemas/producto.schema';

@Injectable()
export class ProductoService {
  constructor(
    @InjectModel(Producto.name) private productoModel: Model<ProductoDocument>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const nuevoProducto = await this.productoModel.create(createProductoDto);
    return nuevoProducto;
  }

  async findAll(): Promise<Producto[]> {
    const productos = await this.productoModel.find()
      .populate('productor', 'nombre email telefono ubicacion');
    return productos;
  }

  async findOne(id: string | number): Promise<Producto> {
    const producto = await this.productoModel.findById(id)
      .populate('productor', 'nombre email telefono ubicacion');
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  async update(id: string | number, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.productoModel.findByIdAndUpdate(id, updateProductoDto, { new: true })
      .populate('productor', 'nombre email telefono ubicacion')
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  async remove(id: string | number): Promise<void> {
    const result = await this.productoModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
  }
}
