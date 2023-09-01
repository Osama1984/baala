import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
  } from 'class-validator';
  
  @ValidatorConstraint({ name: 'isNestedObjectNotEmpty', async: false })
  export class IsNestedObjectNotEmptyConstraint
    implements ValidatorConstraintInterface
  {
    validate(value: any): boolean {
      return (
        value && value.address!=undefined && value.state!=undefined && value.city!=undefined && value.country!=undefined && value.zip!=undefined 
      )
    }
  }
  
  export function IsNestedObjectNotEmpty(validationOptions?: ValidationOptions) {
    return function (object: Record<string, any>, propertyName: string) {
      registerDecorator({
        name: 'isNestedObjectNotEmpty',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: IsNestedObjectNotEmptyConstraint,
      });
    };
  }