import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { AuthResponseDto } from 'src/modules/auth/dtos/response.dto';

interface ClassConstructor {
  new (...args: any[]): object;
}

export function AuthSerialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: AuthResponseDto) => {
        return plainToClass(this.dto, data, {
          excludePrefixes: ['password'],
        });
      }),
    );
    // throw new Error("Method not implemented.");
  }
}
