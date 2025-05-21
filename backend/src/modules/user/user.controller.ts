import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './user.service';
import { Public } from '../../decorators/public.decorator';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UserController {
    constructor(private readonly usersService: UsersService) {}

    @Get('all')
    async getAllUsers(){
        return this.usersService.getUsers({});
    }
    
    @Get(':id')
    async getUser(@Param('id') userId: number){
        return this.usersService.getUser({ id: Number(userId) });
    }

    @Public()
    @Post('register')
    async registerUser(
        @Body() userData: { name: string, email: string, password: string }
    ){
        return this.usersService.createUser(userData)
    }
}
