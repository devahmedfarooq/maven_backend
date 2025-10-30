import { Controller, Post, Body, UseGuards, Req, Put, Patch, Param, Get, Delete, Query } from '@nestjs/common';
import { AdminGuard } from './admin.guard';
import { updateRatelimitDto } from './dto/updateRateLimit.dto';
import { AdminService } from './admin.service';
import { CreateAdsDto } from './dto/createAds.dto';
import { UpdateAdsDto } from './dto/updateAds.dto';
import { GetAdsDto } from './dto/get-ads.dto';




@Controller('admin')
export class AdminController {

    constructor(private readonly adminService: AdminService) { }

    @Post('/update-limits')
    @UseGuards(AdminGuard)
    async updateRateLimits(@Body() updateRatelimitDto: updateRatelimitDto) {
        return await this.adminService.updateLimit(updateRatelimitDto)
    }


    @Post('/ads')

    async createNewAds(@Body() createAdsDto: CreateAdsDto, @Req() req: Request) {
        return await this.adminService.createAds(createAdsDto)
    }

    @Get("/ads")
    async getAds(@Query() query: GetAdsDto) {
        return await this.adminService.getAds(query);
    }

    @Get("/ads/admin")
    async getAdsForAdmin(@Query() query: GetAdsDto) {
        return await this.adminService.getAdsForAdmin(query);
    }

    @Get("/ads/all")
    async getAllAds() {
        return await this.adminService.getAllAds();
    }

    @Patch('/ads/:id')
    async updateAds(@Body() updateAdsDto: UpdateAdsDto, @Param("id") id: string) {
        return await this.adminService.updateAds(id, updateAdsDto)
    }

    @Patch('/increment/:id')
    async incrementAds(@Param("id") id: string, @Query("index") index: number) {
        return await this.adminService.getAndIncrementAds(id, index)
    }

    @Patch('/track-view/:id')
    async trackAdView(@Param("id") id: string, @Query("index") index: number) {
        return await this.adminService.trackAdView(id, index)
    }

    @Patch('/track-click/:id')
    async trackAdClick(@Param("id") id: string, @Query("index") index: number) {
        return await this.adminService.trackAdClick(id, index)
    }

    @Delete('/ads/:id')
    @UseGuards(AdminGuard)
    async deleteAds(@Param("id") id: string) {
        return await this.adminService.deleteAds(id)
    }

    @Get("/ads/:id")
    async getAd(@Param("id") id: string) {
        return await this.adminService.getAd(id)
    }


    @Get('/feed')
    async getFeed() {
        return await this.adminService.adminFeed()
    }

}
