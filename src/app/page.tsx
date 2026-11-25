import Collections from '@/components/Collections';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Gallery from '@/components/gallery/Gallery';
import Hero from '@/components/Hero';
import Loader from '@/components/Loader';
import Manifesto from '@/components/Manifesto';
import Nav from '@/components/Nav';
import Packs from '@/components/packs/Packs';
import Process from '@/components/Process';
import SmoothScroll from '@/components/SmoothScroll';
import Visit from '@/components/Visit';

export default function Home() {
  return (
    <SmoothScroll>
      <Loader />
      <Nav />
      <main>
        <Hero />
        <Manifesto />
        <Process />
        <Collections />
        <Gallery />
        <Packs />
        <Contact />
        <Visit />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
