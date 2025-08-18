import {
  IsNotEmpty,
  MaxLength,
  MinLength,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'passwordMatch', async: false })
export class PasswordMatchConstraint implements ValidatorConstraintInterface {
  validate(repeatedPassword: string, args: ValidationArguments) {
    const object = args.object as UpdatePasswordDto;
    return object.password === repeatedPassword;
  }

  defaultMessage() {
    // Removed unused args parameter
    return 'PASSWORwDS_DO_NOT_MATCH';
  }
}

export class UpdatePasswordDto {
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(64)
  password: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(64)
  @Validate(PasswordMatchConstraint)
  repeated_password: string;
}
