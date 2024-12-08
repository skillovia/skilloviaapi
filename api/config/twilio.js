// const twilio = require("twilio");

// class TwilioConfig {
//   constructor() {
//     this.client = twilio(
//       process.env.TWILIO_ACCOUNT_SID,
//       process.env.TWILIO_AUTH_TOKEN
//     );
//     this.phoneNumber = process.env.TWILIO_PHONE_NUMBER;
//   }

//   /**
//    * Send a verification code via SMS.
//    * @param {string} phone - The recipient's phone number.
//    * @returns {Promise<object>} - The Twilio message object or an error.
//    */
//   async sendVerificationCode(phone) {
//     try {
//       const message = await this.client.messages.create({
//         from: this.phoneNumber,
//         to: phone,
//         body: "Your verification code is: ",
//       });
//       console.log(`Verification code sent to ${phone}:`, message.sid);
//       return message;
//     } catch (error) {
//       console.error("Error sending verification code:", error.message || error);
//       return error.message || error;
//       //throw new Error('Failed to send verification code');
//     }
//   }

//   /**
//    * Verify a code for a given phone number.
//    * @param {string} phone - The phone number to verify.
//    * @param {string} code - The verification code entered by the user.
//    * @returns {Promise<boolean>} - Returns true if verified successfully, otherwise false.
//    */

//   async verifyCode(phone, code) {
//     try {
//       const verificationCheck = await this.client.verify.v2
//         .services(process.env.TWILIO_ACCOUNT_SID)
//         .verificationChecks.create({ code: code, to: phone });

//       if (verificationCheck.status === "approved") {
//         console.log("Verification successful for:", phone);
//         return verificationCheck;
//       } else {
//         console.log("Verification failed for:", phone);
//         return verificationCheck;
//       }
//     } catch (error) {
//       console.error("Error verifying code:", error.message || error);
//       //throw new Error('Failed to verify code');
//       return error.message || error;
//     }
//   }
// }

// module.exports = new TwilioConfig();

// const twilio = require("twilio");

// class TwilioConfig {
//   constructor() {
//     this.client = twilio(
//       process.env.TWILIO_ACCOUNT_SID,
//       process.env.TWILIO_AUTH_TOKEN
//     );
//     this.phoneNumber = process.env.TWILIO_PHONE_NUMBER; // This is your purchased Twilio phone number
//     this.verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID; // This is your Twilio Verify Service SID
//   }

//   /**
//    * Send a verification code via Twilio Verify.
//    * @param {string} phone - The recipient's phone number.
//    * @returns {Promise<object>} - The Twilio verification object or an error.
//    */
//   async sendVerificationCode(phone) {
//     try {
//       // Send the verification code using the Verify API
//       const verification = await this.client.verify.v2
//         .services(this.verifyServiceSid) // Verify service SID
//         .verifications.create({ to: phone, channel: "sms" });

//       console.log(`Verification code sent to ${phone}:`, verification.sid);
//       return verification;
//     } catch (error) {
//       console.error("Error sending verification code:", error.message || error);
//       return error.message || error;
//     }
//   }

//   /**
//    * Verify a code for a given phone number.
//    * @param {string} phone - The phone number to verify.
//    * @param {string} code - The verification code entered by the user.
//    * @returns {Promise<boolean>} - Returns true if verified successfully, otherwise false.
//    */
//   async verifyCode(phone, code) {
//     try {
//       const verificationCheck = await this.client.verify.v2
//         .services(this.verifyServiceSid) // Verify service SID
//         .verificationChecks.create({ code: code, to: phone });

//       if (verificationCheck.status === "approved") {
//         console.log("Verification successful for:", phone);
//         return true;
//       } else {
//         console.log("Verification failed for:", phone);
//         return false;
//       }
//     } catch (error) {
//       console.error("Error verifying code:", error.message || error);
//       return false;
//     }
//   }
// }

// module.exports = new TwilioConfig();
const twilio = require("twilio");

class TwilioConfig {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.phoneNumber = process.env.TWILIO_PHONE_NUMBER;
  }

  /**
   * Send a verification code via SMS.
   * @param {string} phone - The recipient's phone number.
   * @returns {Promise<object>} - The Twilio message object or an error.
   */

  async sendVerificationCode(phone) {
    try {
      const verification = await this.client.verify.v2
        .services(process.env.TWILIO_SERVICE_SID)
        .verifications.create({
          channel: "sms",
          to: phone,
        });

      console.log(verification.sid);
      return verification;
    } catch (error) {
      console.error("Error sending verification code:", error.message || error);
      return error.message || error;
      //throw new Error('Failed to send verification code');
    }
  }

  /**
   * Verify a code for a given phone number.
   * @param {string} phone - The phone number to verify.
   * @param {string} code - The verification code entered by the user.
   * @returns {Promise<boolean>} - Returns true if verified successfully, otherwise false.
   */

  async verifyCode(phone, code) {
    try {
      const verificationCheck = await this.client.verify.v2
        .services(process.env.TWILIO_SERVICE_SID)
        .verificationChecks.create({ code: code, to: phone });

      if (verificationCheck.status === "approved") {
        console.log("Verification successful for:", verificationCheck);
        return verificationCheck;
      } else {
        console.log("Verification failed for:", verificationCheck);
        return verificationCheck;
      }
    } catch (error) {
      console.error("Error verifying code:", error.message || error);
      //throw new Error('Failed to verify code');
      return error.message || error;
    }
  }
}

module.exports = new TwilioConfig();
