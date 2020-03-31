'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const TokenSchema = new Schema({
    name: {
      type: String,
      unique: true,
    },
    id: {
      type: String,
    },
    supply: {
      type: String,
    },
    precision: {
      type: Number,
    },
  });
  const Token = mongoose.model('Token', TokenSchema);

  return Token;
};
