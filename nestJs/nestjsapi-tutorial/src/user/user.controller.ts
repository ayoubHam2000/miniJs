import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { EditUserDto } from './dto';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}

    @HttpCode(HttpStatus.OK)
    @Get('me')
    getMe(@GetUser() user : User) {
        return user
    }

    @Patch()
    editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
        return this.userService.editUser(userId, dto)
    }

}
