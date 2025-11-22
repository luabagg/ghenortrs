import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Hero from './sections/Hero';
import About from './sections/About';
import Products from './sections/Products';
import Testimonials from './sections/Testimonials';
import FAQ from './sections/FAQ';
import B2BContact from './sections/B2BContact';
import Instagram from './sections/Instagram';

function App() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <About />
      <Products />
      <Testimonials />
      <FAQ />
      <B2BContact />
      <Instagram />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default App;
