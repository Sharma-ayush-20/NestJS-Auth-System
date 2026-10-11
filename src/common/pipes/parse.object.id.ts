import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

/**
 This function is a NestJS custom validation pipe. It acts like a security guard standing at the door of your controller method. Before the URL parameter id ever reaches your code, NestJS automatically passes it into this transform function to inspect it.
 */
@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, string> {
  transform(value: any): string {
    const isValid = Types.ObjectId.isValid(value);
    if (!isValid) {
      throw new BadRequestException('Invalid ID format');
    }
    return value;
  }
}
