import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
  Logger,
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
        try {
          return plainToClass(this.dto, data, {
            excludePrefixes: ['password', 'devices'],
          });
        } catch (error) {
          Logger.error('Serialization failed in AuthInterceptor', error);
          throw error;
        }
      }),
    );
    // throw new Error("Method not implemented.");
  }
}
