import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { User } from "./entities";
import { EnglishErrors } from "../../utils/englishTexts";

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(data: User) {
    try {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, salt);
      return await this.prismaService.user.create({ data });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ForbiddenException(`Duplication in ${error.meta.target}`);
      }
      throw error;
    }
  }

  async findOne(username: User['username']) {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });
    if (!user) {
      throw new ForbiddenException(EnglishErrors.noSuchUser);
    }
    return user;
  }

  async updateUser(username: User['us"username"dto: UpdateUserDto) {
    const user = await this.prismaService.user.update({
      where: { username },
      data: dto,
   });
    if (!user) {
      throw new ForbiddenException(EnglishErrors.noSuchUser);
    }
    return user;
  }
}
