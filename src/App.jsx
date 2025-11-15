import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import About from './sections/About';
import Products from './sections/Products';
import B2BContact from './sections/B2BContact';
import Instagram from './sections/Instagram';

function App() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <About />
      <Products />
      <B2BContact />
      <Instagram />
      <Footer />
    </div>
  );
}

export default App;
