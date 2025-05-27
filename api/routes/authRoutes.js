const express = require("express");
const {
  registerUser,
  login,
  refreshToken,
  refreshTokenWeb,
  resetPassword,
  changePassword,
  verifyPhone,
  sendVerificationCode,
  AllVerifyEmail,
  resendEmailVerirficationCode,
  adminDelete,
  forgotPassword,
} = require("../controllers/authController");
const passport = require("passport");
const router = express.Router();
const { getClientIp } = require("../middlewares/ipgetter");

router.post("/register", registerUser);
router.post("/login", getClientIp, login);
router.delete("/user/:email", adminDelete);
router.get("/get/refreshtoken", refreshToken);
router.get("/get/refreshtokenweb", refreshTokenWeb);
router.put("/reset/password/:id", changePassword);
router.put("/reset/password", changePassword);
router.post("/sendverificationcode", sendVerificationCode);
router.post("/verifyphone", verifyPhone);
router.post("/verify/email", AllVerifyEmail);
router.post("/resend/code", resendEmailVerirficationCode);
router.post("/forgot/password", forgotPassword);
router.post("/reset/forgot/password", resetPassword);

// Redirect to Google for authentication
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// Callback route for Google to redirect to
// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "/login",
//     session: false,
//   }),
//   (req, res) => {
//     const token = req.user.token;
//     /* res.status(200).json({
//             status: 'success',
//             message: 'Login was successful',
//             data: {accessToken: token, refreshToken:token},
//         }); */

//     res.redirect(
//       `http://localhost:5173/explore?accessToken=${token}&refreshToken=${token}`
//     );
//     console.log("Redirecting with token:", token);
//   }
// );
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    console.log("User Object from Passport:", req.user); // Check if req.user exists
    console.log("Generated Token:", req.user?.token); // Check if the token is available

    if (!req.user || !req.user.token) {
      return res.status(400).json({ message: "Token not generated." });
    }

    const token = req.user.token;
    res.redirect(
      `http://localhost:5173/explore?accessToken=${token}&refreshToken=${token}`
    );
  }
);

module.exports = router;
