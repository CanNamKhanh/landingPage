import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const AccordionArr = [
  {
    id: 1,
    trigger: "Is boosting safe?",
    content:
      "We take account security seriously. Our boosters follow strict security procedures and VPN protection can be provided when available.",
  },
  {
    id: 2,
    trigger: "Do you use bots?",
    content: "No. All orders are completed manually by experienced players.",
  },
  {
    id: 3,
    trigger: "How long does boosting take?",
    content:
      "Delivery time depends on the selected game, rank, and current demand. Estimated completion times are shown during checkout.",
  },
  {
    id: 4,
    trigger: "Can i play while my order is active?",
    content:
      "For most services, we recommend avoiding gameplay during the boost. Specific instructions will be provided after purchase.",
  },
  {
    id: 5,
    trigger: "Will i recive progress updates?",
    content:
      "Yes. Our support team can provide updates through Discord, Telegram, or email.",
  },
  {
    id: 6,
    trigger: "What payment methods do you accept?",
    content:
      "We accept PayPal, Visa, Mastercard, Apple Pay, Cryptocurrency, Wise, and other available payment methods.",
  },
  {
    id: 7,
    trigger: "What happens if my desired rank cannot be reached?",
    content:
      "Our support team will review each case individually and discuss available options with you.",
  },
  {
    id: 8,
    trigger: "How do I contact support?",
    content:
      "You can reach us through Discord, Telegram, Whatsapp, email, or the contact form on our website.",
  },
];

function FAQ() {
  return (
    <div
      id="faq"
      className="w-full mt-20 items-center flex flex-col gap-8 pb-25 reveal "
    >
      <span className="flex flex-col items-center text-center">
        <h2 className="text-5xl md:text-4xl font-bold mb-4 select-none text-black">
          FREQUENTLY ASKED{" "}
          <span className="text-[#B642F0] text-shadow-[0_0_40px_rgba(182,66,240,0.8)]">
            QUESTIONS
          </span>
        </h2>
        <span className="text-[16px] text-black/50 select-none">
          Everything you need to know before placing your order
        </span>
      </span>

      <Accordion
        type="single"
        collapsible
        defaultValue="Is boosting safe?"
        className="max-w-3xl w-[80%] bg-[#FFFFFF] text-black rounded-xl p-5"
      >
        {AccordionArr.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.trigger}
            className="border-gray-200!"
          >
            <AccordionTrigger className="px-5 cursor-pointer text-md hover:no-underline hover:text-[#B842F0] font-medium">
              {item.trigger}
            </AccordionTrigger>
            <AccordionContent className="px-5 text-sm text-black/60 font-medium">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default FAQ;
