import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { LoginAuthDto, RegisterAuthDto } from "./dto";
import { AuthGuard } from "@nestjs/passport";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseInterceptors(AnyFilesInterceptor())
    @Post('user/signup')
    userSignup(@Body() dto: RegisterAuthDto) {
        return this.authService.userSignup(dto);
    }

    @HttpCode(HttpStatus.OK)
    @UseInterceptors(AnyFilesInterceptor())
    @Post('user/login')
    userLogin(@Body() dto: LoginAuthDto) {
        return this.authService.userSignin(dto);
    }

    @HttpCode(HttpStatus.OK)
    @UseInterceptors(AnyFilesInterceptor())
    @Post('admin/login')
    adminLogin(@Body() dto: LoginAuthDto) {
        return this.authService.signinAdmin(dto);
    }

    @Get('users')
    getUsers() {
        return this.authService.getAllUsers();
    }

    @Put("users/:id")
    updateUser(
        @Param("id", ParseIntPipe) id: number,
        @Body() dto: Partial<LoginAuthDto>) {
        return this.authService.putUser(id, dto)
    }

    @Delete("users/:id")
    deleteUser(@Param("id", ParseIntPipe) id: number) {
        return this.authService.deleteUser(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getProfile(@Req() req) {
        return this.authService.getUserById(req.user.id);
    }


}