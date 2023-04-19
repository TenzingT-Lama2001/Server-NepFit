import { SortOrder } from "mongoose";
import Membership, {
  MembershipDocument,
} from "../../models/membership/membership.model";
import Booking, {
  BookingDocument,
  IBooking,
} from "../../models/booking/booking.model";

export interface CreateBooking extends IBooking {}
export async function createBooking({
  member,
  trainer,
  startDate,
  endDate,
  address,
}: CreateBooking) {
  await Booking.create({
    member,
    trainer,
    startDate,
    endDate,
    address,
  });
}

export type GetBookings = {
  pageNumber: number;
  pageSize: number;
  searchQuery: string;
  sortBy: string;
  order: string;
};
export async function getBookings({
  pageNumber,
  pageSize,
  searchQuery,
  sortBy,
  order,
}: GetBookings) {
  const regex = new RegExp(searchQuery, "i");
  const pageNumberPositive = Math.max(pageNumber + 1, 1);
  const query = Booking.find({ status: "pending" })
    .skip((pageNumberPositive - 1) * pageSize)
    .limit(pageSize);

  if (sortBy) {
    const sort: { [key: string]: SortOrder } = {};
    sort[sortBy] = order === "asc" ? 1 : -1;
    query.sort(sort);
  }
  const bookings = await query;
  const totalBookings = await Booking.countDocuments({});

  bookings.map((booking) => {});
  return {
    bookings,
    totalBookings,
  };
}
export async function getOneBooking(id: string) {
  const booking = await Booking.findById(id);
  return booking;
}

export async function deleteBooking(bookingId: string) {
  await Booking.findByIdAndDelete(bookingId);
}
type UpdateBooking = [
  {
    bookingId: string;
    status: string;
  }
];

export async function updateBooking(bookingData: UpdateBooking) {
  console.log("in update ", bookingData);

  const updatedBooking = await Promise.all(
    bookingData.map(async (item) => {
      return await Booking.findByIdAndUpdate(
        item.bookingId,
        { status: item.status.toLowerCase() },
        { new: true, runValidators: true }
      );
    })
  );

  return updatedBooking;
}
export async function getApprovedBookings(id: any) {
  const approvedBookings = await Booking.find({
    trainer: id,
    status: "approved",
  }).exec();
  console.log({ approvedBookings });
  return approvedBookings;
}
