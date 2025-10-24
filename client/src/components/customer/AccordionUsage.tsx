import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { grey } from '@mui/material/colors';

export default function AccordionUsage() {  
  return (
    <div>
      <Accordion sx={{bgcolor: grey[900]}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{color: 'white'}} />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span" sx={{color: 'white', fontWeight: 500, fontSize: 20}}>How do I create and manage my account?</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{color: 'white'}}>
          You can create an account by signing up with your email address. Once registered, go to your Manage Address View to edit, update and delete addresses and view your order history.
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{bgcolor: grey[900]}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{color: 'white'}}/>}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography component="span" sx={{color: 'white', fontWeight: 500, fontSize: 20}}>What happens if I place an order and then realise I made a mistake?</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{color: 'white'}}>
          If the order is still marked as “pending” in your dashboard, you may cancel or edit it (depending on how far the kitchen/merchant has processed it). After the merchant has begun preparing the order, changes or cancellations may not be possible. In that case, contact support or the merchant directly via the contact details in your order receipt.
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{bgcolor: grey[900]}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{color: 'white'}}/>}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          <Typography component="span" sx={{color: 'white', fontWeight: 500, fontSize: 20}}>How are payments, refunds and failed transactions handled?</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{color: 'white'}}>
          Payments are processed securely via the integrated payment provider. If the transaction fails (for example invalid card, network error), you'll receive a notification and you'll need to retry or choose a different payment method. If you are owed a refund (e.g., order cancellation, merchant issue), the refund will be processed back to the original payment method - please allow the standard banking timeframe (which may be a few business days) for the funds to reflect.
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{bgcolor: grey[900]}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{color: 'white'}}/>}
          aria-controls="panel4-content"
          id="panel4-header"
        >
          <Typography component="span" sx={{color: 'white', fontWeight: 500, fontSize: 20}}>How do I get set up as a merchant and start receiving orders?</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{color: 'white'}}>
          First, register your merchant profile. Once approved, you'll configure menu items, pricing and operating hours, and link your payout account. After setup, you can begin receiving and processing orders from customers through the application.
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{bgcolor: grey[900]}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{color: 'white'}}/>}
          aria-controls="panel5-content"
          id="panel5-header"
        >
          <Typography component="span" sx={{color: 'white', fontWeight: 500, fontSize: 20}}>What are my responsibilities for order fulfilment and how do I mark an order as complete?</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{color: 'white'}}>
          It's your responsibility to monitor incoming orders, begin preparation within the expected time-window, and mark the order status appropriately (e.g., “In Preparation”, “Ready for Pickup/Delivery”, “Completed”). If any delay or issue arises (e.g., item out of stock), you should update the order status and optionally communicate with the customer to manage expectations. When you dispatch or hand off the order to the customer or delivery person, mark it “Completed” so that the system can trigger any customer notifications and your payout processing.
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{bgcolor: grey[900]}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{color: 'white'}}/>}
          aria-controls="panel6-content"
          id="panel6-header"
        >
          <Typography component="span" sx={{color: 'white', fontWeight: 500, fontSize: 20}}>How should I handle menu items that are temporarily unavailable or out of stock?</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{color: 'white'}}>
          When a dish or ingredient is unavailable, mark the item in your menu as “out of stock” or hide the item until you are able to serve it again. This avoids customer frustration from ordering something you cannot deliver. Regularly review your inventory and update status in your merchant dashboard to keep your listing accurate and trustworthy.
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
