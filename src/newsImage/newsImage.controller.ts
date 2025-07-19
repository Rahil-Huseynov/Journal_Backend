import {
  Controller, Post, Get, Put, Delete,
  Param, Body, ParseIntPipe, BadRequestException,
  UseInterceptors, UploadedFile,
  UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateNewsImageDto } from './dto/create-news-image.dto';
import { UpdateNewsImageDto } from './dto/update-news-image.dto';
import { NewsImageService } from './newsImage.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/auth/guard';

@Controller('news-images')
export class NewsImageController {
  constructor(private readonly svc: NewsImageService) { }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body('newsId', ParseIntPipe) newsId: number,
    @Body() dto: CreateNewsImageDto,
  ) {
    if (!file) throw new BadRequestException('Şəkil yüklənməyib');
    dto.newsId = newsId;
    dto.image = `uploads/news/${file.filename}`;
    return this.svc.create(dto);
  }

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateNewsImageDto,
  ) {
    if (file) dto.image = `uploads/news/${file.filename}`;
    return this.svc.update(id, dto);
  }

  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}
