import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Req,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
  Body,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { AdminGuard } from 'src/auth/guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) { }

  @Get()
  findAll() {
    return this.authorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.authorService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(@Req() req: Request) {
    const body = req.body;

    if (body.categoryIds && typeof body.categoryIds === 'string') {
      body.categoryIds = JSON.parse(body.categoryIds);
    }

    return this.authorService.create(body);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    return this.authorService.update(id, body);
  }


  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.authorService.remove(id);
  }
}
