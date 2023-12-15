const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
      trim: true,
    },
    discountPercentage: {
      type: Number,
      min: [1, "wrong min discount"],
      max: [99, "wrong max discount"],
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "Please add a brand"],
      trim: true,
    },
    colors: { type: [mongoose.Schema.Types.Mixed] },
    sizes: { type: [mongoose.Schema.Types.Mixed] },
    stock: { type: Number, min: [0, "wrong min stock"], default: 0 },
    highlights: { type: [String] },
    discountPrice: {
      type: Number,
    },
    images: {
      type: [String],
      required: [true, "Please add images"],
    },
    imageSrc: {
      type: String,
      required: [true, "Please add images"],
    },
    rating: {
      type: Number,
      min: [0, "wrong min rating"],
      max: [5, "wrong max price"],
      default: 0,
    },
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const virtualId = productSchema.virtual("id");
virtualId.get(function () {
  return this._id;
});
// we can't sort using the virtual fields. better to make this field at time of doc creation
// const virtualDiscountPrice =  productSchema.virtual('discountPrice');
// virtualDiscountPrice.get(function(){
//     return Math.round(this.price*(1-this.discountPercentage/100));
// })
productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
