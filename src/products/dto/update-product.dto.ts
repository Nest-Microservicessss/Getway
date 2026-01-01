import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product-dt';

export class UpdateProductDto extends PartialType(CreateProductDto) {

    

}
