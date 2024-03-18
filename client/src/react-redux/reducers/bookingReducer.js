const initialBooking = {
  bookingId: "",
  place: "",
  user: null,
  checkIn: new Date(),
  checkOut: new Date(),
  name: "",
  phone: "",
  numberOfGuests: 0,
  price: "",
};

export const bookingReducer = (state = initialBooking, action) => {
  console.log("state in booking reducer: ", state);
  switch (action.type) {
    case "UPDATE_BOOKING":
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};
