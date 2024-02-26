import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config({ path: "./config/dev.config.env" });

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

export const sendSMS = async ({body,from}) => {
  const message = await client.messages.create({
    body ,
    to:process.env.RECEIVE_SMS_TO ,
    from,
  });
  console.log(message);
};
