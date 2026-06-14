function AcceptPaymentMethods() {
  const paymentMethods = [
    {
      imgSrc: "/paypal.png",
      title: "PayPal",
    },
    {
      imgSrc: "/apple-pay.png",
      title: "Apple Pay",
    },
    {
      imgSrc: "/visa.png",
      title: "Visa",
    },
    {
      imgSrc: "/master-card.png",
      title: "Master Card",
    },
    {
      imgSrc: "/american-express.png",
      title: "American Express",
    },
    {
      imgSrc: "/discover.png",
      title: "Discover",
    },
    {
      imgSrc: "/jcb.png",
      title: "JCB",
    },
    {
      imgSrc: "/btc.png",
      title: "BTC",
    },
    {
      imgSrc: "/wise.png",
      title: "Wise",
    },
    {
      imgSrc: "/payoneer.png",
      title: "Payoneer",
    },
    {
      imgSrc: "/bank-tranfer.png",
      title: "Bank Tranfer",
    },
    {
      imgSrc: "/more.png",
      title: "More",
    },
  ];

  return (
    <div className="mx-auto w-full select-none py-12 flex reveal flex-col items-center border-t border-[#f4d7ff] gap-10">
      <h2 className="text-black/50 text-[14px]">ACCEPTED PAYMENT METHODS</h2>
      <div className="flex items-center mx-auto gap-5 flex-wrap justify-center">
        {paymentMethods.map((item, index) => (
          <div
            key={index}
            className="flex flex-col w-20 cursor-pointer items-center gap-2 opacity-80 hover:opacity-100"
          >
            <div className="rounded-xl h-15 w-20 flex justify-center items-center bg-white">
              <img
                src={item.imgSrc}
                alt={item.title}
                className="h-12 rounded-xl"
              />
            </div>
            <span className="text-black/50 max-w-full truncate text-[12px]">
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AcceptPaymentMethods;
