const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/95 to-primary py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,theme(colors.blue.500/20),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,theme(colors.secondary/10),transparent_50%)]" />
      <div className="container relative mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white bg-clip-text">
              Your Personal Contract Guide
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Instant, accurate contract interpretation for airline professionals. Get the answers you need, when you need them.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src="/lovable-uploads/4d0b5f1f-ee3c-422d-81df-9db600490aec.png"
              alt="SkyGuide Logo"
              className="w-64 md:w-96 drop-shadow-xl transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;