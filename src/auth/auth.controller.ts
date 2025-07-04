import { Body, Controller, Delete, ForbiddenException, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { LoginAuthDto, RegisterAdminAuthDto, RegisterAuthDto } from "./dto";
import { AuthGuard } from "@nestjs/passport";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseInterceptors(AnyFilesInterceptor())
    @Post('user/signup')
    async userSignup(@Body() dto: RegisterAuthDto) {
        return this.authService.userSignup(dto);
    }

    @UseInterceptors(AnyFilesInterceptor())
    @Post('admin/signup')
    adminSignup(@Body() dto: RegisterAdminAuthDto) {
        return this.authService.adminSignup(dto);
    }


    @HttpCode(HttpStatus.OK)
    @UseInterceptors(AnyFilesInterceptor())
    @Post('login')
    async login(@Body() dto: LoginAuthDto) {
        return this.authService.signin(dto);
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
    async getProfile(@Req() req) {
        if (!req.user.id) {
            throw new ForbiddenException('User ID not found in token');
        }

        if (req.user.isAdmin) {
            return this.authService.getAdminById(req.user.id);
        }

        return this.authService.getUserById(req.user.id);
    }

}