import type { Metadata } from 'next';
import PublicHeader from '@/components/common/PublicHeader';
import ClientFooter from '@/components/common/ClientFooter';
import HomeInteractive from './components/HomeInteractive';

export const metadata: Metadata = {
  title: 'Home - Quirky Umbrella',
  description:
    'Welcome to Quirky Umbrella - Your trusted partner for innovative corporate branding solutions, digital marketing services, and industry expertise across multiple sectors.',
};

export default function HomePage() {
  const heroData = {
    title: 'Smarter Marketing With Real Growth.',
    subtitle: 'Intelligent systems powering AI-led marketing & E-Commerce growth.',
    ctaText: 'Get Your Free Growth Audit',
    ctaLink: '#growth-audit',
    heroImage: '/assets/images/hero-growth.jpg',
    heroImageAlt: 'Abstract growth illustration with data curve and gradient background',
  };

  const statsData = {
    title: 'Our Global Reach',
    subtitle:
      'Delivering excellence across continents with proven results and satisfied clients worldwide',
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
        name: 'Sundance Institute',
        logo: '/assets/images/smarteyetechnology.png',
        alt: 'Sundance Institute logo',
      },
      {
        id: '2',
        name: 'Mindvalley',
        logo: '/assets/images/Mindvalley.png',
        alt: 'Mindvalley logo',
      },
      {
        id: '3',
        name: 'ManpowerGroup',
        logo: '/assets/images/ManpowerGroup.png',
        alt: 'ManpowerGroup logo',
      },
      {
        id: '4',
        name: 'TELUS',
        logo: '/assets/images/TELUS.png',
        alt: 'TELUS logo',
      },
      {
        id: '5',
        name: 'damex.io',
        logo: '/assets/images/damex.webp',
        alt: 'damex.io logo',
      },
      {
        id: '6',
        name: 'DOOR International',
        logo: '/assets/images/DOORInternational.png',
        alt: 'DOOR International logo',
      },
      {
        id: '7',
        name: 'BUNKR',
        logo: '/assets/images/BUNKR.png',
        alt: 'BUNKR logo',
      },
      {
        id: '8',
        name: 'SHOOTY',
        logo: '/assets/images/SHOOTY.png',
        alt: 'SHOOTY logo',
      },
      {
        id: '9',
        name: 'ImpactableX',
        logo: '/assets/images/ImpactableX.png',
        alt: 'ImpactableX logo',
      },
      {
        id: '10',
        name: 'Realiste',
        logo: '/assets/images/Realiste.png',
        alt: 'Realiste logo',
      },
      {
        id: '11',
        name: 'GoCharlie',
        logo: '/assets/images/GoCharlie.png',
        alt: 'GoCharlie logo',
      },
      {
        id: '12',
        name: 'Lana',
        logo: '/assets/images/lana.png',
        alt: 'Lana logo',
      },
      {
        id: '13',
        name: 'Rachel Cho Floral Design',
        logo: '/assets/images/Rachel.png',
        alt: 'Rachel Cho Floral Design logo',
      },
      {
        id: '14',
        name: 'Sustainably Run',
        logo: '/assets/images/SustainablyRun.png',
        alt: 'Sustainably Run logo',
      },
      {
        id: '15',
        name: 'Smart Eye Technology',
        logo: '/assets/images/smarteyetechnology.png',
        alt: 'Smart Eye Technology logo',
      },
      {
        id: '16',
        name: 'VOLTA',
        logo: '/assets/images/VOLTA.png',
        alt: 'VOLTA logo',
      },
      {
        id: '17',
        name: 'Sparkinity',
        logo: '/assets/images/Sparkinity.png',
        alt: 'Sparkinity logo',
      },
      {
        id: '18',
        name: 'Flock',
        logo: '/assets/images/Flock.png',
        alt: 'Flock logo',
      },
      {
        id: '19',
        name: 'Crypto.com Arena',
        logo: '/assets/images/Crypto.svg',
        alt: 'Crypto.com Arena logo',
      },
      {
        id: '20',
        name: 'Parents Academy',
        logo: '/assets/images/parentsacademy.png',
        alt: 'Parents Academy logo',
      },
      {
        id: '21',
        name: 'allabouteve',
        logo: '/assets/images/allabouteve.png',
        alt: 'allabouteve logo',
      },
      {
        id: '22',
        name: 'Hunnybun',
        logo: '/assets/images/hunnybun.png',
        alt: 'Hunnybun logo',
      },
      {
        id: '23',
        name: 'Aunt Bonnie',
        logo: '/assets/images/auntbenne.webp',
        alt: 'Milk Bomb logo',
      },
      {
        id: '24',
        name: 'YDBG',
        logo: '/assets/images/ydbg.png',
        alt: 'YDBG logo',
      },
      {
        id: '25',
        name: 'Source & Self',
        logo: '/assets/images/Source.png',
        alt: 'Source & Self logo',
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      {/* No top padding on Home so header blends into Hero */}
      <main className="flex-1">
        <HomeInteractive heroData={heroData} statsData={statsData} clientsData={clientsData} />
      </main>
      <ClientFooter />
    </div>
  );
}
