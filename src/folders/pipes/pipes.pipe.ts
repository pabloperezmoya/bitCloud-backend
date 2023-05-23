import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class FolderNamePipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): string {
    const regex = /^[a-zA-Z0-9_-]+$/g;

    if (!regex.test(value)) {
      throw new BadRequestException('Folder name contains invalid characters');
    }

    return value.trim().toLowerCase();
  }
}
