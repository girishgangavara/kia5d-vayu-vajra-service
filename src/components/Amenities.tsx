import { Wind, Armchair, Luggage, CreditCard, Volume2, Accessibility, Tv } from 'lucide-react';

const amenities = [
  {
    icon: Wind,
    title: "Air Conditioning",
    description: "Fully climate controlled Volvo buses",
    color: "text-blue-400"
  },
  {
    icon: Armchair,
    title: "Comfortable Seats",
    description: "Premium reclining seats for relaxation",
    color: "text-purple-400"
  },
  {
    icon: Luggage,
    title: "Luggage Space",
    description: "Spacious storage for your travel bags",
    color: "text-accent"
  },
  {
    icon: Tv,
    title: "LED Displays",
    description: "Route information & announcements",
    color: "text-green-400"
  },
  {
    icon: CreditCard,
    title: "Digital Payments",
    description: "UPI & Cash payments accepted",
    color: "text-orange-400"
  },
  {
    icon: Volume2,
    title: "PA System",
    description: "Clear stop announcements",
    color: "text-pink-400"
  },
  {
    icon: Accessibility,
    title: "Accessible",
    description: "Low floor buses with easy access",
    color: "text-teal-400"
  }
];

const Amenities = () => {
  return (
    <section id="amenities" className="py-24 relative bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-gold">Premium Amenities</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience comfort and convenience with world-class facilities
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {amenities.map((amenity, index) => (
            <div
              key={amenity.title}
              className="glass-strong p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-secondary flex items-center justify-center group-hover:shadow-glow transition-shadow">
                <amenity.icon className={`w-7 h-7 ${amenity.color}`} />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{amenity.title}</h3>
              <p className="text-xs text-muted-foreground">{amenity.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Amenities;
