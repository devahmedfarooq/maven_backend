import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Booking, BookingDocument } from "./schema/booking.schema";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { UpdateBookingDto } from "./dto/update-booking.dto";
import { NotificationService } from "src/notification/notification.service";

@Injectable()
export class BookingService {
    constructor(@InjectModel(Booking.name) private bookingModel: Model<BookingDocument>, private readonly notificationService: NotificationService) { }

    async createBooking(createBookingDto: CreateBookingDto, req: Request): Promise<Booking> {
        // Step 1: Create details and (optional) appointment
        const { appointment, details, summary, personalInfo } = createBookingDto;
        
        // Step 2: Validate the summary with proper floating point handling
        if (summary && summary.subtotal !== undefined && summary.gst !== undefined && summary.total !== undefined) {
            const calculatedTotal = summary.subtotal + summary.gst;
            const tolerance = 0.01; // Allow for small floating point differences
            
            if (Math.abs(summary.total - calculatedTotal) > tolerance) {
                throw new Error("Total amount does not match subtotal + GST.");
            }
        }

        // Step 3: Create the booking entry
        const newBooking = new this.bookingModel({
            appointment: appointment ?? null,
            details,
            summary,
            personalInfo,
            userId: req['user'].id,
            status: 'pending'
        });

        await newBooking.save();
        this.notificationService.logAction("New Booking Created", "Booking", String(newBooking._id))
        return newBooking;
    }

    async updateBooking(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
        console.log(updateBookingDto)
        const updatedBooking = await this.bookingModel.findByIdAndUpdate(id, updateBookingDto, { new: true, runValidators: true });

        if (!updatedBooking) {
            throw new NotFoundException("Booking not found");
        }
        this.notificationService.logAction("Booking Updated", "Booking", String(updatedBooking._id))

        return updatedBooking;
    }


    async getAllBookings(
        page = 1,
        limit = 10,
        filters: any,
        user: any
    ): Promise<{ data: Booking[]; total: number }> {
        const skip = (page - 1) * limit;

        console.log("User : ",user)
        // Apply user-specific filtering
        // console.log(user)
        if (user.role !== 'admin') {
            filters.userId = user.id;
        }
        console.log("Filters ", filters)
        const [bookings, total] = await Promise.all([
            this.bookingModel.find(filters).skip(skip).limit(limit).exec(),
            this.bookingModel.countDocuments(filters),
        ]);

        if (!bookings || bookings.length === 0) {
            throw new NotFoundException('No bookings found.');
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

        this.notificationService.logAction("Booking Deleted", "Booking", String(deleted._id))

        return { message: "Booking successfully deleted" };
    }
}