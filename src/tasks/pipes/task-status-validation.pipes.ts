import { PipeTransform, BadRequestException } from '@nestjs/common';

export class TaskStatusPipe implements PipeTransform {
  transform(value: any) {
    const validStatus = ['DONE', 'IN_PROGRESS', 'OPEN'];

    if (
      !(typeof value === 'string' && validStatus.includes(value.toUpperCase()))
    ) {
      throw new BadRequestException(`'${value}' is not a valid status`);
    }
    return value;
  }
}
