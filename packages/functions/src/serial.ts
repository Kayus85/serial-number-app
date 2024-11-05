import { Serial } from "@serial-number-app/core/serial";

const serial = Serial.create({
  serialID: "kaykay",
  serialNumber: "123",
  userID: "456",
  productID: "wow",
  processed: false,
  created: new Date(),
});
