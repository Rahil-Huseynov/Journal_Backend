import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, Headers, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import { ForgotPasswordDto, LoginAuthDto, RegisterAdminAuthDto, RegisterAuthDto, ResetPasswordDto, UpdateUserDto } from "./dto";
import { AuthGuard } from "@nestjs/passport";
import { JwtGuard } from "./guard";

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

    @UseGuards(AuthGuard('jwt'))
    @Put('users/:id')
    @UseInterceptors(AnyFilesInterceptor())
    async updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Req() req
    ) {
        return this.authService.putUser(id, req.body);
    }

    @Post('forgot-password')
    forgotPassword(
        @Body() dto: ForgotPasswordDto,
        @Headers('accept-language') rawLocale: string
    ) {
        const locale = rawLocale ? rawLocale.split(',')[0].split('-')[0] : 'az';
        return this.authService.forgotPassword(dto.email, locale);
    }


    @Post('reset-password')
    async resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(dto.token, dto.newPassword);
    }

    @Get('check-token')
    async checkToken(@Query('token') token: string) {
        const valid = await this.authService.checkToken(token);
        return { valid };
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
    @UseGuards(JwtGuard)
    @Patch('users/password')
    @UseInterceptors(AnyFilesInterceptor())
    async updatePassword(@Req() req) {
        const userId = req.user.sub;
        const currentPassword = req.body['currentPassword'];
        const newPassword = req.body['newPassword'];
        return this.authService.updatePassword(userId, currentPassword, newPassword);
    }

}