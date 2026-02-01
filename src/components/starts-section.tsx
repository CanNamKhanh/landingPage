"use client";

export function StatsSection() {
  const stats = [
    { number: "500+", label: "Orders Completed" },
    { number: "100%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Support Available" },
  ];

  return (
    <section className="relative w-full py-20 px-4 bg-background overflow-visible">
      {/* Glow background */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#ff1a8c1a] to-transparent blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="flex justify-center gap-32">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group text-center cursor-pointer transition-transform duration-300 hover:scale-105"
            >
              {/* Number */}
              <div className="relative mb-3">
                {/* Glow behind number */}
                <div className="absolute inset-0 blur-2xl bg-[#FF1A8C]/40 opacity-80 group-hover:opacity-100 transition-opacity" />

                <div className="relative text-5xl md:text-6xl font-bold text-[#FF1A8C] drop-shadow-[0_0_20px_#FF1A8Caa]">
                  {stat.number}
                </div>
              </div>

              {/* Label */}
              <p className="text-base md:text-lg text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
