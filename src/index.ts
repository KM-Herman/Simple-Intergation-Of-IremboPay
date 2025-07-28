import { createInvoice, getInvoice } from "./service/iremboService";


const run = async () => {
  try {
    console.log("Creating Invoice...");

    const invoice = await createInvoice();
    const invoiceNumber = invoice.invoiceNumber;
    const paymentLink = invoice.paymentLinkUrl;
    console.log("Invoice Created:", invoiceNumber);

    if (!invoice || !invoice.invoiceNumber || !invoice.customer.phoneNumber) {
      console.log("Invoice creation failed or missing fields");
    }

    console.log("Invoice Created:", invoice);


    console.log("Getting Invoice...");
    const invoiceInfo = await getInvoice(invoiceNumber);
    if (!invoiceInfo) {

      console.log("Failed to retrieve invoice");
    }
    console.log("Invoice Info:", invoiceInfo);

    if (!paymentLink) {
        console.log("Payment link is missing ");
        }else{
          console.log(`Open your browser and visit this url: ${paymentLink}`)
        }



    // console.log("Updating Invoice...");
    // const updatedInvoice = await updateInvoice(invoiceNumber);
    // console.log("Updated Invoice:", updatedInvoice);

//     console.log("Initiating Payment...");
//     const payment = await pushPayment(invoiceNumber, telNumber);
//     console.log("Payment Initiated:", payment);

 } catch (error) {
     console.error("Error:", error);
   }
};

run();
function useEffect(arg0: () => void, arg1: any[]) {
  throw new Error("Function not implemented.");
}

