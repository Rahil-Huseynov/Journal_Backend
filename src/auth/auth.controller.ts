import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { AnyFilesInterceptor } from "@nestjs/platform-express";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseInterceptors(AnyFilesInterceptor())
    @Post('user/signup')
    userSignup(@Body() dto: AuthDto) {
        return this.authService.userSignup(dto);
    }

    @HttpCode(HttpStatus.OK)
    @UseInterceptors(AnyFilesInterceptor())
    @Post('user/login')
    userLogin(@Body() dto: AuthDto) {
        return this.authService.userSignin(dto);
    }
    
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(AnyFilesInterceptor())
    @Post('admin/login')
    adminLogin(@Body() dto: AuthDto) {
        return this.authService.signinAdmin(dto);
    }

    @Get('users')
    getUsers() {
        return this.authService.getAllUsers();
    }

    @Put("users/:id")
    updateUser(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: Partial<AuthDto>) {
        return this.authService.putUser(id, dto)
    }

    @Delete("users/:id")
    deleteUser(@Param("id", ParseIntPipe) id: number) {
        return this.authService.deleteUser(id);
    }


}