import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  username: { type: String, required: true },
  first_name: { type: String },
  last_name: { type: String },
  wallet: {
    balance: { type: Number, default: 0 }, // Wallet balance
    amount_sent: { type: Number, default: 0 }, // Total amount the user has sent in transactions
    transaction_status: { type: String, default: 'inactive' }, // Transaction status
    number_referred: { type: Number, default: 0 }, // Number of users referred
    transaction_hash: { type: String }, // Transaction hash
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
