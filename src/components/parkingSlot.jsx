import React from "react";
import { Card, CardContent, Typography, Button, Grid } from "@mui/material";

const ParkingSlot = ({ slot, onBook }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Card sx={{ minWidth: 275, marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          Spot {slot.number}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {slot.isAvailable ? "Available" : "Occupied"}
        </Typography>
        {slot.isAvailable && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => onBook(slot._id)}
          >
            Book Now
          </Button>
        )}
      </CardContent>
    </Card>
  </Grid>
);

export default ParkingSlot;
