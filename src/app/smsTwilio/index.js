const { env } = require("process");

const sendSMS = ({ body, phone }) => {
  const accountSid = env.ACCOUNT_SID;
  const authToken = env.AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);
  client.messages
    .create({
      body: body,
      to: `+84${phone.slice(1)}`, // Text your number
      from: "+14708024107", // From a valid Twilio number
    })
    .then((message) => {
      //   console.log(message);
    });
};

module.exports = sendSMS;
