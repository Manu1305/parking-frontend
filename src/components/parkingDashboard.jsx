import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const ParkingDashboard = () => {
  const [parkingSpots, setParkingSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(2);
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParkingSpots = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://51.21.129.112/api/parking/spots",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setParkingSpots(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching parking spots:", err);
        setLoading(false);
        alert("Unauthorized! Please log in again.");
        navigate("/login");
      }
    };

    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://51.21.129.112/api/wallet", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBalance(response.data.balance);
      } catch (err) {
        console.error("Error fetching wallet balance:", err);
        alert("Failed to fetch wallet balance.");
      }
    };

    const checkLowBalance = () => {
      if (balance < 50) {
        alert("Low balance! Please recharge your wallet.");
      }
    };

    fetchParkingSpots();
    fetchBalance();

    const intervalId = setInterval(() => {
      fetchBalance();
      checkLowBalance();
    }, 10 * 60 * 1000);

    const socket = io("http://51.21.129.112");

    socket.on("parkingUpdate", (updatedSpots) => {
      setParkingSpots(updatedSpots);
    });

    return () => {
      clearInterval(intervalId);
      socket.disconnect();
    };
  }, [balance, navigate]);

  const handleBookSpot = async (spotId) => {
    if (balance < 50) {
      alert("Insufficient balance! Please recharge to book a parking spot.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://51.21.129.112/api/parking/book",
        {
          spotId: spotId,
          durationHours: duration,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data.message || "Spot booked successfully!");
    } catch (err) {
      console.error("Error booking the spot:", err);
      alert(err.response?.data?.error || "Failed to book the spot.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Typography variant="h4">Parking Dashboard</Typography>
        <Button variant="contained" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      <Typography variant="body1" align="center" gutterBottom>
        Current Wallet Balance: ₹{balance}
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        Default Duration: {duration} hours
      </Typography>
      <Box display="flex" justifyContent="center" gap={2} mb={4}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/wallet")}
        >
          Go to Recharge
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/history")}
        >
          My Booking History
        </Button>
      </Box>
      {/* <Box display="flex" justifyContent="center" mb={4}>
        <TextField
          label="Duration (hours)"
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          inputProps={{ min: 1, max: 24 }}
          sx={{ width: 200 }}
        />
      </Box> */}
      <Grid container spacing={3}>
        {parkingSpots.map((spot) => (
          <Grid item xs={12} sm={6} md={4} key={spot._id}>
            <Card
              sx={{
                backgroundColor: spot.isAvailable ? "#e3fcef" : "#f8d7da",
                border: `2px solid ${spot.isAvailable ? "#28a745" : "#dc3545"}`,
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Spot: {spot.name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Price: ₹{spot.price}
                </Typography>
                <Typography
                  variant="body2"
                  color={spot.isAvailable ? "success.main" : "error.main"}
                  gutterBottom
                >
                  {spot.isAvailable ? "Available" : "Not Available"}
                </Typography>
                {spot.isAvailable && (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleBookSpot(spot._id)}
                  >
                    Book Now
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ParkingDashboard;
