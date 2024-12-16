import { applyDecorators } from '@nestjs/common';
import { Controller } from '@nestjs/common/interfaces';
import { ApiHeader } from '@nestjs/swagger';
import { AuthorizationHeaders } from '../headers';

export const BypassAddressApiHeader = (): (<TFunction extends () => void, Y>(
  target: Controller | TFunction,
  propertyKey?: string | symbol | undefined,
  descriptor?: TypedPropertyDescriptor<Y> | undefined,
) => void) => {
  return applyDecorators(
    ApiHeader({
      name: AuthorizationHeaders.userAddress,
      description: 'Use this header for bypassing authorization guards.',
    }),
  );
};
