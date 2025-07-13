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
} from '@nestjs/common';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { AuthorService } from './author.service';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

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

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async create(@Req() req: Request) {
    const body = req.body;

    if (body.categoryIds && typeof body.categoryIds === 'string') {
      body.categoryIds = JSON.parse(body.categoryIds);
    }

    return this.authorService.create(body);
  }


  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File, 
    @Body() body: any, 
  ) {
    return this.authorService.update(id, body);
  }



  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.authorService.remove(id);
  }
}
