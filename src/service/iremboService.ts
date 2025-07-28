import IremboPaySDK from "@irembo/irembopay-node-sdk";
import { CONFIG } from "../config";
import crypto from "crypto";

const iPay = new IremboPaySDK(
    CONFIG.IPAY_SECRET_KEY,
    CONFIG.IPAY_ENVIRONMENT
    );

export const createInvoice = async () => {
  const res = await iPay.invoice.createInvoice({
    transactionId: "TST-" + Date.now(),
    paymentAccountIdentifier: "your PAI", //use the payment account identifier you created in the iremboPay dashboard
    customer: {
      email: "johndoe@example.com",
      phoneNumber: "0780000001",
      name: "John Doe",
    },
    paymentItems: [
      {
        unitAmount: 100000,
        quantity: 1,
        code: "	PC-55f26de62e",// create a product and use its code here
      },
    ],
    description: "Test invoice",
    expiryAt: new Date(Date.now() + 86400000).toISOString(),
    language: "EN",
  });
  return (res as any).data ?? res;
};

export const getInvoice = async (invoiceNumber: string) => {
  return await iPay.invoice.getInvoice(invoiceNumber);
};

export const updateInvoice = async (invoiceNumber: string) => {
  return await iPay.invoice.updateInvoice(invoiceNumber,
    {
    expiryAt: new Date(Date.now() + 172800000).toISOString(),
    paymentItems: [
      {
        unitAmount: 500000,
        quantity: 1,
        code: "PC-a1efcac927",
      },
    ],
  });
};

export const pushPayment = async (invoiceNumber: string, tel: string) => {
  return await iPay.payment.mobileMoney.initiatePayment({
    accountIdentifier: tel,
    paymentProvider: "MTN", // or "AIRTEL"
    invoiceNumber: invoiceNumber,
    transactionReference: "MTN_" + Date.now(),
  });
};



export interface VerifySignatureProps {
  secretKey: string | Buffer;
  payload: string;
  signatureHeader: string;
  tSeconds?: number; // this is the seconds in the past or future the timestamp is allowed to drift from the current time
}

export function VerifySignature({
  secretKey,
  payload,
  signatureHeader,
  tSeconds = 300, //5min
}: VerifySignatureProps): boolean {

  const parts = signatureHeader.split(",").map(p => p.trim());
  let timestamp: string | null = null;
  let signatureHash: string | null = null;

  for (const part of parts) {
    const [k, v] = part.split("=");
    if (k === "t") timestamp = v;
    else if (k === "s") signatureHash = v;
  }

  if (!timestamp || !signatureHash) return false;

  const signedPayload = `${timestamp}#${payload}`;


  const expectedSignatureHex = crypto
    .createHmac("sha256", secretKey)
    .update(signedPayload)
    .digest("hex");


  const signBuf = Buffer.from(signatureHash, "hex");
  const expectedBuf = Buffer.from(expectedSignatureHex, "hex");
  if (signBuf.length !== expectedBuf.length) return false;

  const isSignValid = crypto.timingSafeEqual(expectedBuf, signBuf);

  const nowMs = Date.now();
  const tmstInt = parseInt(timestamp, 10);
  if (Number.isNaN(tmstInt)) return false;

  // const tsMs = tsInt < 1e12 ? tsInt * 1000 : tsInt; // if you expect timestamps in seconds
  const tmstMs = tmstInt;

  if (Math.abs(nowMs - tmstMs) > tSeconds * 1000) return false;

  return isSignValid;
}