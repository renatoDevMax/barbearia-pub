import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
    unique: true,
  },
    userPhone: {
    type: String,
    required: false,
  },
  userDatas: {
    type: [Date],
    default: [],
  },
  // Campos do NextAuth
  name: String,
  email: String,
  image: String,
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
