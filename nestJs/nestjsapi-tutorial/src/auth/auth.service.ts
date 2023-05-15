import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";

@Injectable({})
export class AuthService {

    constructor(private prisma: PrismaService, private jwt: JwtService) {

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

            delete user.hash

            return user
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


        delete user.hash
        return user
    }
}