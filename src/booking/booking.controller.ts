import { Controller, Get, Post, Patch, Delete, Param, Query, Body, Req, UseGuards } from "@nestjs/common";
import { BookingService } from './booking.service';
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";
import { AuthGuard } from "src/auth/auth.guard";
import { AdminGuard } from "src/admin/admin.guard";
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }
  @Post("")
  @UseGuards(AuthGuard)
  async createBooking(@Body() createBookingDto: CreateBookingDto, @Req() req: Request) {
    return this.bookingService.createBooking(createBookingDto, req);
  }

  @Get("")
  @UseGuards( AuthGuard)
  async getAllBookings(@Query() query: any, @Req() req: Request) {
    let { page = 1, limit = 10, ...filters } = query;
    return this.bookingService.getAllBookings(page, limit, filters, req['user']);
  }

  @Get("/:id")
  @UseGuards(AuthGuard)
  async getBookingById(@Param("id") id: string) {
    return this.bookingService.getBookingById(id);
  }


  @Patch(":id")
  @UseGuards(AuthGuard)
  async updateBooking(@Param("id") id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.updateBooking(id, updateBookingDto);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  async deleteBooking(@Param("id") id: string) {
    return this.bookingService.deleteBooking(id);
  }

}
