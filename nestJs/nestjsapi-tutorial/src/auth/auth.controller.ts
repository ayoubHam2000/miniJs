import { Body, Controller, HttpCode, HttpStatus, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Pool, Client } from 'pg';
import { AuthDto } from "./dto";

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('signin')
    signin(@Body() dto: AuthDto) {
        console.log(dto)
        return this.authService.signin(dto)
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('signup')
    signup(@Body() dto: AuthDto) {
        return this.authService.signup(dto)
    }

}