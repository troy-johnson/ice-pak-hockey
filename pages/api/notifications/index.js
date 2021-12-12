import twilio from "twilio";

const notificationHandler = async (req, res) => {
   switch (req.method) {
      case "POST":
         try {
            const { recipients, message } = req.body;

            const result = [];

            const textClient = twilio(
               process.env.TWILIO_ACCOUNT_SID,
               process.env.TWILIO_AUTH_TOKEN
            );

            const sendTexts = async () => {
               for (const player of recipients) {
                  try {
                     await textClient.messages.create({
                        from: "(714) 519-2916",
                        to: player,
                        body: message,
                     });

                     console.log(`Successfully sent sms notification to ${player}`);

                     result.push({
                        phoneNumber: player,
                        status: "success",
                     });
                  } catch (error) {
                     console.log(`Error sending sms notification to ${player}: `, error);

                     result.push({
                        phoneNumber: player,
                        status: "error",
                     });
                  }
               }
            };

            await sendTexts();

            return res.status(200).json({ result });
         } catch (error) {
            console.log("error", error);
            return res.status(400).json({ message: error });
         }
      default:
         break;
   }
};

export default notificationHandler;
