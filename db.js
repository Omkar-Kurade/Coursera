const { Schema, default: mongoose } = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Enter a valid email"],
    unique: true,
  },
  password: { type: String, required: [true, "Enter a valid password"] },
  firstName: { type: String },
  lastName: { type: String },
});

const adminSchema = new Schema({
  email: {
    type: String,
    required: [true, "Enter a valid email"],
    unique: true,
  },
  password: { type: String, require: [true, "Enter a valid password"] },
  firstName: { type: String },
  lastName: { type: String },
});

const courseSchema = new Schema({
  title: { type: String },
  description: { type: String },
  price: { type: Number },
  imageUrl: { type: String },
  createrId: ObjectId,
});

const purchaseSchema = new Schema({
  userId: ObjectId,
  courseId: ObjectId,
});

const usermodule = mongoose.model("user", userSchema);
const adminmodule = mongoose.model("admin", adminSchema);
const coursemodule = mongoose.model("course", courseSchema);
const purchasemodule = mongoose.model("purchase", purchaseSchema);

module.exports = { usermodule, adminmodule, coursemodule, purchasemodule };
