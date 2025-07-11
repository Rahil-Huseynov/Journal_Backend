import {
    Controller,
    Post,
    Put,
    Param,
    Body,
    ParseIntPipe,
    UseInterceptors,
    UploadedFile,
    Get,
    Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { NewsService } from './news.service';

const storage = diskStorage({
    destination: './uploads/news',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    },
});

@Controller('news')
export class NewsController {
    constructor(private readonly newsService: NewsService) { }

    @Get()
    async getAll() {
        return this.newsService.getAll();
    }

    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number) {
        return this.newsService.getById(id);
    }

    @Post()
    @UseInterceptors(FileInterceptor('image', { storage }))
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any,
    ) {
        const dto = {
            ...body,
            image: file ? file.filename : null,
        };
        return this.newsService.create(dto);
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('image', { storage }))
    async update(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any,
    ) {
        const dto = {
            ...body,
            ...(file && { image: file.filename }),
        };
        return this.newsService.update(id, dto);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.newsService.delete(id);
    }

}
