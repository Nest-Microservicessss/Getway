import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { PaginationDto } from '../common/dto/pagination.dto';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateProductDto } from './dto/create-product-dt';
import { UpdateProductDto } from './dto/update-product.dto';
import { NATS_SERVICE } from 'src/config/services';



@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client:ClientProxy
  ) {}

  @Post()
  CreateProduct(@Body() createProsuctDto:CreateProductDto){
    return this.client.send({cmd:'create_product'},createProsuctDto)
  }

  @Get()
  FindAllProducts(@Query() paginationDto:PaginationDto){
    return this.client.send({cmd:'find_all'},paginationDto)
  }

  @Get(':id')
  async findProductById(@Param('id')id:string){

    try {

      const product = await firstValueFrom(
        this.client.send({cmd:'find_one_product'},{id})
      )
      return product      
    } catch (error) {
      throw new RpcException(error)
    }

    
  }

  @Delete(":id")
  async deleteProduct(@Param('id',ParseIntPipe) id:string){

    try {

      const product = await firstValueFrom(
        this.client.send({cmd:'delete_product'},{id})
      )
      return product      
    } catch (error) {
      throw new RpcException(error)
    }
    
  }

   @Patch(':id')
  patchProduct(
    @Param('id',ParseIntPipe)id:number,
    @Body()updateProductDto:UpdateProductDto){
      return this.client.send({cmd:'update_product'},{
        id,
        ...updateProductDto}).pipe(
          catchError(err=>{throw new RpcException(err)})
        )
  }
}
