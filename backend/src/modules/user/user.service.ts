import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import { User, Prisma } from '@prisma/client';
import { SecurityService } from '../security/security.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private securityService: SecurityService) {}

  async getUser(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    try {
      return this.prisma.user.findUnique({
        where: userWhereUniqueInput,
      });
    } catch (e) {
      console.error(e);
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    try {
      return this.prisma.user.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });
    } catch (e) {
      console.error(e);
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    try {
      const { name, email, password } = data;
      const hashedPassword = this.securityService.createPasswordHash(password);
      return this.prisma.user.create({
        data: {name, email, password: hashedPassword}
      });
    } catch (e) {
      console.error(e);
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    try {
      return this.prisma.user.update({
        data,
        where,
      });
    } catch (e) {
      console.error(e);
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<void> {
    try {
      await this.prisma.user.delete({
        where,
      });
    } catch (e) {
      console.error(e);
      throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
