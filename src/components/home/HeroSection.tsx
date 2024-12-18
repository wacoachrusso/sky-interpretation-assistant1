const HeroSection = () => {
  return (
    <section className="bg-primary py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Personal Contract Guide
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Instant, accurate contract interpretation for airline professionals. Get the answers you need, when you need them.
            </p>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src="/lovable-uploads/4d0b5f1f-ee3c-422d-81df-9db600490aec.png"
              alt="SkyGuide Logo"
              className="w-64 md:w-96"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;