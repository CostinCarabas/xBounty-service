import {
  NativeRegularJwtGuard, RegularJwtUser, RegularJwtUserDecorator,
} from '@XBounty/core';
import {
  Controller, HttpStatus, Post, UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth, ApiOperation, ApiResponse, ApiTags,
} from '@nestjs/swagger';
import { CreateUserService } from './create/create-user.service';

@Controller({
  path: 'users',
  version: '1',
})
@ApiTags('Users')
@ApiBearerAuth('JWT')
export class UsersController {
  constructor(
    private readonly createUserService: CreateUserService,
  ) { }

  @Post('create')
  @ApiOperation({
    summary: 'This API will create a new user for erd address',
    description: 'Possible scenarios:\n' +
      '- Invalid Native Auth JWT Token, it will return Unauthorized Status Code (401). \n' +
      '- Expired Native Auth JWT Token, it will return Forbidden Status Code (403). \n' +
      '- User already exists, it will return BadRequest Status Code (400). \n' +
      '- User was created - will return status *success* (200).\n',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @UseGuards(NativeRegularJwtGuard)
  create(
    @RegularJwtUserDecorator() user: RegularJwtUser,
  ): Promise<void> {
    return this.createUserService.execute(user);
  }
}
