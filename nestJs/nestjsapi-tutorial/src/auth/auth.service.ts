import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable({})
export class AuthService {

    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {

    }

    async signup(dto: AuthDto) {
        try {
            const hash = await argon.hash(dto.passowrd);

            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash: hash
                }
            })

            return this.signToken(user.id, user.email)
        } catch (error: any) {
            //if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2002') { //credential code
                return new ForbiddenException('Creadentials taken')
            }
            //}

            throw error

        }
    }


    async signin(dto: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })

        if (!user) {
            throw new ForbiddenException("Credential Incorrect")
        }

        const pwMatches = await argon.verify(user.hash, dto.passowrd)

        if (!pwMatches) {
            throw new ForbiddenException("Credential Inclorrect")
        }

        return this.signToken(user.id, user.email)
    }

    async signToken(userId : number, email: string) : Promise<{"access_token" : string}> {
        const payload = {
            sub: userId,
            email: email 
        }

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: this.config.get("JWT_SECRET")
        })

        return {
            "access_token": token
        }
    }


}
