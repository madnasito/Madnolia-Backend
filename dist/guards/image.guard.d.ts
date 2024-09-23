import { ValidationArguments, ValidatorConstraintInterface } from "class-validator";
export declare class IsImageFile implements ValidatorConstraintInterface {
    validate(mimeType: string, args: ValidationArguments): boolean;
    defaultMessage(validationArguments?: ValidationArguments): string;
}
