'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const PairSchema = new Schema({
    id: String,
    base: {
      id: String,
      name: String,
      precision: Number,
    },
    quote: {
      id: String,
      name: String,
      precision: Number,
    },
    info: {
      last_price: Number,
      change: Number,
      volume: Number,
    },
    book: {
      last_price: Number,
      amount: Number,
      total: Number,
    },
    choose: {
      last_price: Number,
      volume: Number,
    },
    form: {
      min_trade_amount: Number,
      amount_step: Number,
      price_step: Number,
      min_order_value: Number,
      total_step: Number,
    },
  });

  const Pair = mongoose.model('Pair', PairSchema);

  return Pair;
};
