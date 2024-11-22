import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import axios from "axios";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://51.21.129.112/api/parking/bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching booking history:", err);
        setLoading(false);
        alert("Failed to load booking history. Please try again.");
      }
    };

    fetchBookingHistory();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Booking History
      </Typography>
      {bookings.length === 0 ? (
        <Typography variant="h6" align="center" color="textSecondary">
          No bookings found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item xs={12} sm={6} md={4} key={booking._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Spot: {booking.parkingSpot.name}
                  </Typography>
                  <Typography variant="body1">
                    Amount Paid: ₹{booking.amountPaid}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Start Time: {new Date(booking.startTime).toLocaleString()}
                  </Typography>
                  {booking.endTime && (
                    <Typography variant="body2" color="textSecondary">
                      End Time: {new Date(booking.endTime).toLocaleString()}
                    </Typography>
                  )}
                  <Typography
                    variant="body2"
                    color={
                      booking.status === "active"
                        ? "success.main"
                        : "error.main"
                    }
                  >
                    Status: {booking.status}
                  </Typography>
                </CardContent>
                {/* <CardActions>
                  {booking.status === "active" && (
                    <Button variant="outlined" color="error">
                      Cancel Booking
                    </Button>
                  )}
                </CardActions> */}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default BookingHistory;
