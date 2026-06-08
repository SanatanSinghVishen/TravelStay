const express = require("express");
const router = express.Router({ mergeParams: true });
const reservations = require("../controllers/reservations");
const { isLoggedIn } = require("../middleware");

// Routes for /api/reservations
router.get("/", isLoggedIn, reservations.getUserReservations);

// Routes for /api/listings/:id/reservations
// Note: We'll export the controller functions and handle the routing in app.js
// so that we can mount it under /api/listings/:id/reservations easily.

router.post("/", isLoggedIn, reservations.createReservation);

module.exports = router;
