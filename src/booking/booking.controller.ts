import { Controller, Get, Post, Patch, Delete, Param, Query, Body } from "@nestjs/common";
import { BookingService } from './booking.service';
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }
  @Post()
  async createBooking(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.createBooking(createBookingDto);
  }

  @Get()
  async getAllBookings(@Query("page") page: number, @Query("limit") limit: number) {
    return this.bookingService.getAllBookings(page, limit);
  }

  @Get(":id")
  async getBookingById(@Param("id") id: string) {
    return this.bookingService.getBookingById(id);
  }

  @Patch(":id")
  async updateBooking(@Param("id") id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.updateBooking(id, updateBookingDto);
  }

  @Delete(":id")
  async deleteBooking(@Param("id") id: string) {
    return this.bookingService.deleteBooking(id);
  }

}
