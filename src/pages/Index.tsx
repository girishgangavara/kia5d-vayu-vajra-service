import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import RouteStops from '@/components/RouteStops';
import Schedule from '@/components/Schedule';
import VehicleFleet from '@/components/VehicleFleet';
import CrewSection from '@/components/CrewSection';
import LiveTracking from '@/components/LiveTracking';
import Amenities from '@/components/Amenities';
import Footer from '@/components/Footer';
import ParticleBackground from '@/components/ParticleBackground';

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      <ParticleBackground />
      <Navbar />
      <main>
        <HeroSection />
        <RouteStops />
        <Schedule />
        <VehicleFleet />
        <CrewSection />
        <LiveTracking />
        <Amenities />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
