import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { CreateBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmark')
export class BookmarkController {

    constructor (private bookmarkService: BookmarkService) {}

    @Get()
    getBookmarks(@GetUser('id') userId: number) {
        return this.bookmarkService.getBookmarks(userId)
    }

    @Get(':id')
    getBookmarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {
        return this.bookmarkService.getBookmarkById(userId, bookmarkId)
    }

    @Post()
    createBookmark(@GetUser('id') userId: number, @Body() dto: CreateBookmarkDto) {
        return this.bookmarkService.createBookmark(userId, dto)
    }

    @Patch(':id')
    editBookmark(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmarkId: number,
        @Body() dto: CreateBookmarkDto
        ) {
        return this.bookmarkService.editBookmark(userId, bookmarkId, dto)
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(":id")
    deleteBookmarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {
        return this.bookmarkService.deleteBookmarkById(userId, bookmarkId)
    }

}
