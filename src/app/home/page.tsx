import type { Metadata } from 'next';
import PublicHeader from '@/components/common/PublicHeader';
import HomeInteractive from './components/HomeInteractive';

export const metadata: Metadata = {
  title: 'Home - Quirky Umbrella',
  description: 'Welcome to Quirky Umbrella - Your trusted partner for innovative corporate branding solutions, digital marketing services, and industry expertise across multiple sectors.',
};

export default function HomePage() {
  const heroData = {
    title: 'Smarter Marketing With Real Growth.',
    subtitle: 'Intelligent systems powering AI-led marketing & E-Commerce growth.',
    ctaText: 'Get Your Free Growth Audit',
    ctaLink: '#growth-audit',
    heroImage: '',
    heroImageAlt: '',
  };

  const statsData = {
    title: 'Our Global Reach',
    subtitle: 'Delivering excellence across continents with proven results and satisfied clients worldwide',
    stats: [
      {
        id: '1',
        value: 500,
        suffix: '+',
        label: 'Projects Completed',
        icon: 'CheckCircleIcon',
      },
      {
        id: '2',
        value: 250,
        suffix: '+',
        label: 'Happy Clients',
        icon: 'UserGroupIcon',
      },
      {
        id: '3',
        value: 50,
        suffix: '+',
        label: 'Countries Served',
        icon: 'GlobeAltIcon',
      },
      {
        id: '4',
        value: 15,
        suffix: '+',
        label: 'Years Experience',
        icon: 'TrophyIcon',
      },
    ],
  };

  const clientsData = {
    title: 'Trusted By Industry Leaders',
    subtitle: 'Join hundreds of companies that trust us with their brand transformation',
    clients: [
      {
        id: '1',
        name: 'TechCorp Solutions',
        logo: 'https://images.pexels.com/photos/6476589/pexels-photo-6476589.jpeg',
        alt: 'TechCorp Solutions logo featuring modern geometric design in blue and silver tones',
      },
      {
        id: '2',
        name: 'Global Finance Group',
        logo: 'https://images.pixabay.com/photo/2016/11/29/12/13/fence-1869401_1280.jpg',
        alt: 'Global Finance Group logo with professional banking emblem in gold and navy blue',
      },
      {
        id: '3',
        name: 'HealthCare Plus',
        logo: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
        alt: 'HealthCare Plus logo displaying medical cross symbol in green and white colors',
      },
      {
        id: '4',
        name: 'EduTech Academy',
        logo: 'https://images.pexels.com/photos/5905857/pexels-photo-5905857.jpeg',
        alt: 'EduTech Academy logo with graduation cap icon in purple and orange gradient',
      },
      {
        id: '5',
        name: 'Retail Masters',
        logo: 'https://images.pixabay.com/photo/2017/08/10/08/47/laptop-2619564_1280.jpg',
        alt: 'Retail Masters logo featuring shopping bag design in red and black colors',
      },
      {
        id: '6',
        name: 'Innovation Labs',
        logo: 'https://images.unsplash.com/photo-1553877522-43269d4ea984',
        alt: 'Innovation Labs logo with lightbulb and circuit pattern in electric blue',
      },
      {
        id: '7',
        name: 'Green Energy Co',
        logo: 'https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg',
        alt: 'Green Energy Co logo displaying leaf and sun symbol in green and yellow',
      },
      {
        id: '8',
        name: 'Digital Dynamics',
        logo: 'https://images.pixabay.com/photo/2016/11/19/14/00/code-1839406_1280.jpg',
        alt: 'Digital Dynamics logo with abstract digital wave pattern in cyan and magenta',
      },
      {
        id: '9',
        name: 'Fashion Forward',
        logo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d',
        alt: 'Fashion Forward logo featuring elegant script typography in rose gold',
      },
      {
        id: '10',
        name: 'Auto Excellence',
        logo: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
        alt: 'Auto Excellence logo with sleek car silhouette in metallic silver and black',
      },
      {
        id: '11',
        name: 'Food Ventures',
        logo: 'https://images.pixabay.com/photo/2017/01/26/02/06/platter-2009590_1280.jpg',
        alt: 'Food Ventures logo displaying chef hat and fork design in warm orange tones',
      },
      {
        id: '12',
        name: 'Travel Horizons',
        logo: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828',
        alt: 'Travel Horizons logo with airplane and compass rose in sky blue and white',
      },
    ],
  };

  return (
    <>
      <PublicHeader />
      <main className="pt-20">
        <HomeInteractive
          heroData={heroData}
          statsData={statsData}
          clientsData={clientsData}
        />
      </main>
    </>
  );
}