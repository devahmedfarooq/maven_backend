import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Booking, BookingDocument } from "./schema/booking.schema";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";

@Injectable()
export class BookingService {
    constructor(@InjectModel(Booking.name) private bookingModel: Model<BookingDocument>) { }

    async createBooking(createBookingDto: CreateBookingDto): Promise<Booking> {
        // Step 1: Create details and (optional) appointment
        const { appointment, details, summary, personalInfo } = createBookingDto;
        // Step 2: Validate the summary
        if (summary.total !== summary.subtotal + summary.gst) {
            throw new Error("Total amount does not match subtotal + GST.");
        }

        // Step 3: Create the booking entry
        const newBooking = new this.bookingModel({
            appointment: appointment ?? null,
            details,
            summary,
            personalInfo
        });

        await newBooking.save();
        return newBooking;
    }

    async updateBooking(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
        console.log(updateBookingDto)
        const updatedBooking = await this.bookingModel.findByIdAndUpdate(id, updateBookingDto, { new: true, runValidators: true });

        if (!updatedBooking) {
            throw new NotFoundException("Booking not found");
        }

        return updatedBooking;
    }


    async getAllBookings(page = 1, limit = 10): Promise<{ data: Booking[]; total: number }> {
        const skip = (page - 1) * limit;
        const [bookings, total] = await Promise.all([
            this.bookingModel.find().skip(skip).limit(limit).exec(),
            this.bookingModel.countDocuments()
        ]);

        if (!bookings || bookings.length === 0) {
            throw new NotFoundException("No bookings found.");
        }

        return { data: bookings, total };
    }

    /**
     * ✅ Get a single booking by ID
     */
    async getBookingById(id: string): Promise<Booking> {
      //  console.log("ID : ", id)

        const booking = await this.bookingModel.findById(id);
       // console.log("Booking: ", booking)
        if (!booking) {
            throw new NotFoundException("Booking not found.");
        }
        return booking;
    }


    async deleteBooking(id: string): Promise<{ message: string }> {
        const deleted = await this.bookingModel.findByIdAndDelete(id);

        if (!deleted) {
            throw new NotFoundException("Booking not found.");
        }

        return { message: "Booking successfully deleted" };
    }
}