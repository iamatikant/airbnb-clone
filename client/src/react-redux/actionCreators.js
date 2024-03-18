export const updateUser = (payload) => {
  return {
    type: "CHECK_USER",
    payload,
  };
};

export const updateBooking = (payload) => {
  console.log("booking payload: ", payload);
  return {
    type: "UPDATE_BOOKING",
    payload,
  };
};
