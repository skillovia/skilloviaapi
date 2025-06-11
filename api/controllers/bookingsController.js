const Bookings = require("../models/Bookings");
const Notification = require("../models/Notifications");

// exports.createBookings = async (req, res) => {
//   const userId = req.user.id;
//   const data = req.body;

//   if(req.body.title != null){
//     let file = null

//     if(req.filePaths != null){
//         const filePath = req.filePaths;
//         file = filePath.slice(15);
//     }

//     try {
//         const bookings = await Bookings.create(userId, data, file);
//         res.status(200).json({ status: 'success', message: 'Skill booked successfully.', data: bookings });
//     } catch (error) {
//         res.status(500).json({status: 'error', message: 'Failed to book skills.', data: error });
//     }

//   } else {
//     res.status(400).send({
//         status: 'error',
//         message: 'Title is required',
//         data: null
//     });
//   }
// };
exports.createBookings = async (req, res) => {
  const userId = req.user.id;
  const data = req.body;

  if (!data.title) {
    return res.status(400).json({
      status: "error",
      message: "Title is required",
      data: null,
    });
  }

  let fileUrl = null;
  if (req.file) {
    fileUrl = req.file.location;
  }

  const filePaths = req.files?.thumbnails
    ? req.files.thumbnails.map((file) => file.location).slice(0, 4)
    : [];

  console.log("📂 Extracted File Paths:", filePaths);

  const {
    skills_id,
    booked_user_id,
    title,
    description,
    booking_location,
    booking_date,
  } = data;

  const formatedData = {
    skills_id,
    booked_user_id,
    title,
    description,
    booking_location,
    booking_date,
    thumbnails: {
      thumbnail01: filePaths[0] || null,
      thumbnail02: filePaths[1] || null,
      thumbnail03: filePaths[2] || null,
      thumbnail04: filePaths[3] || null,
    },
  };

  // try {
  //   const bookings = await Bookings.create(userId, formatedData);
  //   res.status(200).json({
  //     status: "success",
  //     message: "Skill booked successfully.",
  //     data: bookings,
  //   });
  // } catch (error) {

  try {
    const bookings = await Bookings.createBooking(
      userId,
      formatedData,
      fileUrl
    );
    res.status(200).json({
      status: "success",
      message: "Skill booked successfully.",
      data: bookings,
    });
  } catch (error) {
    console.error("Error in createBookings:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to book skills.",
      data: error.message, // just send error.message for clarity
    });
  }
};

exports.updateBookings = async (req, res) => {
  // const bookingsId = parseInt(req.params.id);
  const bookingsId = req.params.id; // ✅ Keep it as a string

  const data = req.body;

  let file = null;
  if (req.filePaths != null) {
    const filePath = req.filePaths;
    file = filePath.slice(15);
  }

  //try {
  const bookings = await Bookings.update(bookingsId, data, file);
  res.status(200).json({
    status: "success",
    message: "Bookings updated successfully.",
    data: bookings,
  });
  /* } catch (error) {
        res.status(500).json({status: 'error', message: 'Failed to update booking.', data: error });
    } */
};

exports.rejectBookings = async (req, res) => {
  const status = "rejected";
  // const bookingsId = parseInt(req.params.id);
  const bookingsId = req.params.id; // ✅ Keep it as a string

  try {
    const data = await Bookings.changeStatus(bookingsId, status);
    await Notification.create({
      userId: data.booking_user_id,
      title: "Booking In Progress",
      description: `Your booking "${data.title}" is now in progress.`,
    });
    res.status(200).json({
      status: "success",
      message: "Bookings rejected successfully.",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to update status.",
      data: error,
    });
  }
};

exports.acceptBookings = async (req, res) => {
  const status = "accepted";
  const bookingsId = req.params.id; // ✅ Keep it as a string

  try {
    const data = await Bookings.changeStatus(bookingsId, status);
    await Notification.create({
      userId: data.booking_user_id,
      title: "Booking Accepted",
      description: `Your booking "${data.title}" has been accepted.`,
    });
    res.status(200).json({
      status: "success",
      message: "Bookings accepted successfully.",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to update status.",
      data: error,
    });
  }
};

// exports.startBooking = async (req, res) => {
//   const status = "in-progress";
//   const bookingId = parseInt(req.params.id);

//   try {
//     const data = await Bookings.changeStatus(bookingId, status);
//     res.status(200).json({
//       status: "success",
//       message: "Booking started successfully.",
//       data: data,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: "Failed to start booking.",
//       data: error,
//     });
//   }
// };

exports.startBooking = async (req, res) => {
  const status = "in-progress";
  // const bookingId = parseInt(req.params.id); // Only using the ID from the URL
  const bookingId = req.params.id; // ✅ Keep it as a string

  try {
    const data = await Bookings.changeStatus(bookingId, status);

    await Notification.create({
      userId: data.booking_user_id,
      title: "Booking In Progress",
      description: `Your booking "${data.title}" is now in progress.`,
    });

    res.status(200).json({
      status: "success",
      message: "Booking started successfully.",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to start booking.",
      data: error,
    });
  }
};

// exports.completeBooking = async (req, res) => {
//   const status = "completed";
//   const bookingId = parseInt(req.params.id);

//   try {
//     const data = await Bookings.changeStatus(bookingId, status);
//     res.status(200).json({
//       status: "success",
//       message: "Booking completed successfully.",
//       data: data,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: "Failed to complete booking.",
//       data: error,
//     });
//   }
// };

// get inward bookings

exports.completeBooking = async (req, res) => {
  const status = req.body.status || "completed"; // Default to "completed" if not passed
  // const bookingId = parseInt(req.params.id);
  const bookingId = req.params.id; // ✅ Keep it as a string

  try {
    const data = await Bookings.changeStatus(bookingId, status);
    await Notification.create({
      userId: data.booking_user_id,
      title: "Booking Completed",
      description: `Your booking "${data.title}" has been completed.`,
    });

    res.status(200).json({
      status: "success",
      message: "Booking completed successfully.",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to complete booking.",
      data: error,
    });
  }
};

// exports.getInwardBookingsByUserId = async (req, res) => {
//   const userId = req.user.id;

//   try {
//     const data = await Bookings.getInwardBookingsByUserId(userId);
//     if (data != null) {
//       res.status(200).json({
//         status: "success",
//         message: "User bookings retrieved successfully.",
//         data: data,
//       });
//     } else {
//       res
//         .status(200)
//         .json({ status: "success", message: "No bookings found", data: [] });
//     }
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: "Failed to retrieve bookings",
//       data: error,
//     });
//   }
// };

// get outward bookings
// exports.getOutwardBookingsByUserId = async (req, res) => {
//   const userId = req.user.id;

//   try {
//     const data = await Bookings.getOutwardBookingsByUserId(userId);
//     if (data != null) {
//       res.status(200).json({
//         status: "success",
//         message: "User bookings retrieved successfully.",
//         data: data,
//       });
//     } else {
//       res
//         .status(200)
//         .json({ status: "success", message: "No bookings found", data: [] });
//     }
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: "Failed to retrieve bookings",
//       data: error,
//     });
//   }
// };

exports.getInwardBookingsByUserId = async (req, res) => {
  const userId = req.user.id;

  try {
    const bookings = await Bookings.getInwardBookingsByUserId(userId);

    if (bookings && bookings.length > 0) {
      const data = bookings.map((booking) => ({
        id: booking._id.toString(),
        skills_id: booking.skills_id,
        booking_user_id: booking.booking_user_id,
        booked_user_id: booking.booked_user_id,
        title: booking.title,
        description: booking.description,
        booking_location: booking.booking_location,
        booking_date: booking.booking_date,
        thumbnail01: booking.thumbnail01,
        thumbnail02: booking.thumbnail02,
        thumbnail03: booking.thumbnail03,
        thumbnail04: booking.thumbnail04,
        file_url: booking.file_url,
        status: booking.status,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      }));

      res.status(200).json({
        status: "success",
        message: "User inward bookings retrieved successfully.",
        data,
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "No inward bookings found",
        data: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve inward bookings",
      data: error.message || error,
    });
  }
};

exports.getOutwardBookingsByUserId = async (req, res) => {
  const userId = req.user.id;

  try {
    const bookings = await Bookings.getOutwardBookingsByUserId(userId);

    if (bookings && bookings.length > 0) {
      // Map bookings to include `id` as string instead of _id
      const data = bookings.map((booking) => ({
        id: booking._id.toString(),
        skills_id: booking.skills_id,
        booking_user_id: booking.booking_user_id,
        booked_user_id: booking.booked_user_id,
        title: booking.title,
        description: booking.description,
        booking_location: booking.booking_location,
        booking_date: booking.booking_date,
        thumbnail01: booking.thumbnail01,
        thumbnail02: booking.thumbnail02,
        thumbnail03: booking.thumbnail03,
        thumbnail04: booking.thumbnail04,
        file_url: booking.file_url,
        status: booking.status,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      }));

      res.status(200).json({
        status: "success",
        message: "User bookings retrieved successfully.",
        data,
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "No bookings found",
        data: [],
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve bookings",
      data: error.message || error,
    });
  }
};

exports.removeBookings = async (req, res) => {
  const userId = req.user.id;
  const id = parseInt(req.params.id);

  try {
    const data = await Bookings.deleteBookings(userId, id);
    res.status(200).json({
      status: "success",
      message: "Bookings deleted successfully.",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to delete bookings.",
      data: error,
    });
  }
};
