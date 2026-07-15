import Hero from '../Component/Home/hero';
import AboutSection from '../Component/Home/aboutSection';
import StatsSection from '../Component/Home/statsSection';
import BrandsSection from '../Component/Home/brandsSection';
import Productshowcase from '../Component/Home/productShowcase';

export default function Homepage() {
  return (
    <div className="page-container">
      <Hero />
      <AboutSection />
      <StatsSection />
      <BrandsSection />
      <Productshowcase />
    </div>
  );
}
      
