function AcceptPaymentMethods() {
  const paymentMethods = [
    {
      imgSrc: "/paypal.png",
      title: "PayPal",
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
  ];

  return (
    <div className="mx-auto w-full select-none py-12 flex reveal flex-col items-center border-y border-gray-800 gap-10">
      <h2 className="text-gray-400 text-[14px]">ACCEPTED PAYMENT METHODS</h2>
      <div className="flex items-center mx-auto gap-12">
        {paymentMethods.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100"
          >
            <img src={item.imgSrc} alt={item.title} className="w-12 h-12" />
            <span className="text-gray-400 text-[12px]">{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AcceptPaymentMethods;
