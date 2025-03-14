import dotenv from "dotenv";

dotenv.config();

export const IS_CLOUD = process.env.CLOUD === "true";

export const STRIPE_PRICES = [
  {
    priceId: "price_1R1fIVDFVprnAny2yJtRRPBm",
    name: "basic100k",
    interval: "month",
    limits: {
      events: 100_000,
    },
  },
  {
    priceId: "price_1R1fKJDFVprnAny2mfiBjkAQ",
    name: "basic250k",
    interval: "month",
    limits: {
      events: 250_000,
    },
  },
  {
    name: "basic500k",
    priceId: "price_1R1fQlDFVprnAny2WwNdiRgT",
    interval: "month",
    limits: {
      events: 500_000,
    },
  },
  {
    name: "basic1m",
    priceId: "price_1R1fR2DFVprnAny28tPEQAwh",
    interval: "month",
    limits: {
      events: 1_000_000,
    },
  },
  {
    name: "basic2m",
    priceId: "price_1R1fRMDFVprnAny24AMo0Vuu",
    interval: "month",
    limits: {
      events: 2_000_000,
    },
  },

  {
    name: "pro100k",
    priceId: "price_1R1fRmDFVprnAny27gL7XFCY",
    interval: "month",
    limits: {
      events: 100_000,
    },
  },
  {
    name: "pro250k",
    priceId: "price_1R1fSADFVprnAny2d7d4tXTs",
    interval: "month",
    limits: {
      events: 250_000,
    },
  },
  {
    name: "pro500k",
    priceId: "price_1R1fSkDFVprnAny2MzBvhPKs",
    interval: "month",
    limits: {
      events: 500_000,
    },
  },
  {
    name: "pro1m",
    priceId: "price_1R1fTMDFVprnAny2IdeB1bLV",
    interval: "month",
    limits: {
      events: 1_000_000,
    },
  },
  {
    name: "pro2m",
    priceId: "price_1R1fTXDFVprnAny2JBLVtkIU",
    interval: "month",
    limits: {
      events: 2_000_000,
    },
  },
];
