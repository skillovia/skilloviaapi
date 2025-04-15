const pool = require("../config/db");
const {
  createConnectedAccount,
  generateAccountLink,
  processSplitPayment,
} = require("../utils/stripe");

// CREATE WALLET
exports.createWalletForUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const existing = await pool.query(
      "SELECT * FROM wallet WHERE user_id = $1",
      [userId]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Wallet already exists" });
    }

    const result = await pool.query(
      "INSERT INTO wallet (user_id, balance, currency) VALUES ($1, $2, $3) RETURNING *",
      [userId, 0, "gbp"]
    );

    res.status(201).json({ message: "Wallet created", wallet: result.rows[0] });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating wallet", error: err.message });
  }
};

// FUND WALLET
exports.fundWallet = async (req, res) => {
  const userId = req.user.id;
  const { amount } = req.body;

  try {
    const user = await pool.query("SELECT email FROM users WHERE id = $1", [
      userId,
    ]);
    const customerEmail = user.rows[0]?.email;

    if (!customerEmail) {
      return res.status(404).json({ message: "User email not found" });
    }

    const clientSecret = await processSplitPayment(
      customerEmail,
      amount / 100, // convert from pence to GBP for the util
      "gbp",
      process.env.PLATFORM_STRIPE_ACCOUNT_ID // or null if just funding wallet
    );

    res.status(200).json({ clientSecret });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create payment intent", error: err.message });
  }
};

// PAY FOR SKILL WITH WALLET
exports.payWithWallet = async (req, res) => {
  const buyerId = req.user.id;
  const { amount, sellerStripeAccountId, sellerUserId } = req.body;

  try {
    const buyerResult = await pool.query(
      "SELECT * FROM wallet WHERE user_id = $1",
      [buyerId]
    );
    const buyerWallet = buyerResult.rows[0];

    if (!buyerWallet || buyerWallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    const appFee = Math.floor(amount * 0.04);
    const sellerAmount = amount - appFee;

    // Deduct from buyer
    await pool.query(
      "UPDATE wallet SET balance = balance - $1, updated_at = NOW() WHERE user_id = $2",
      [amount, buyerId]
    );

    // Credit to seller
    await pool.query(
      "UPDATE wallet SET balance = balance + $1, updated_at = NOW() WHERE user_id = $2",
      [sellerAmount, sellerUserId]
    );

    // Optionally: Record transaction or notify seller...

    res.status(200).json({ message: "Payment successful" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to complete payment", error: err.message });
  }
};

// GET WALLET BALANCE
exports.getWalletBalance = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "SELECT balance, currency FROM wallet WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch wallet balance", error: err.message });
  }
};
