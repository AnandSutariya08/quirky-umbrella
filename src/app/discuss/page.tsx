import type { Metadata } from 'next';
import PublicHeader from '@/components/common/PublicHeader';
import ClientFooter from '@/components/common/ClientFooter';
import { ArrowTrendingUpIcon, LightBulbIcon, UserGroupIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { ArrowRight, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Discuss - Quirky Umbrella',
  description:
    'Discuss growth strategies and innovative solutions with Quirky Umbrella. Learn about our approach to sustainable business growth and measurable results.',
};

export default function DiscussPage() {
  const points = [
    {
      title: 'Strategic Growth',
      icon: ArrowTrendingUpIcon,
      desc: 'Identifying high-impact opportunities for expansion and building scalable systems.',
      gradient: 'from-pink-500 to-rose-500',
      shadow: 'shadow-pink-200'
    },
    {
      title: 'Innovation-Driven',
      icon: LightBulbIcon,
      desc: 'Leveraging AI and cutting-edge tech to stay ahead of market shifts.',
      gradient: 'from-blue-500 to-cyan-500',
      shadow: 'shadow-blue-200'
    },
    {
      title: 'Customer-Centric',
      icon: UserGroupIcon,
      desc: 'Building deep relationships and delivering exceptional user value at every touchpoint.',
      gradient: 'from-emerald-500 to-teal-500',
      shadow: 'shadow-emerald-200'
    },
    {
      title: 'Measurable Results',
      icon: RocketLaunchIcon,
      desc: 'Every strategy is tracked, measured, and optimized for maximum ROI.',
      gradient: 'from-orange-500 to-amber-500',
      shadow: 'shadow-orange-200'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      <PublicHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-50/50 via-transparent to-transparent opacity-70" />
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-pink-100/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="w-full px-6 lg:px-12 relative z-10">
            <div className="max-w-[1400px] mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-10 animate-slide-in">
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white shadow-2xl mb-2">
                    <MessageSquare className="w-4 h-4 text-pink-400" />
                    <span className="text-sm font-black uppercase tracking-[0.2em]">Growth Dialogue</span>
                  </div>
                  
                  <h1 className="font-heading text-6xl lg:text-8xl font-black text-slate-900 leading-[1.05] tracking-tight">
                    Let&apos;s Build <br />
                    <span className="bg-gradient-to-r from-pink-500 via-blue-600 to-emerald-500 bg-clip-text text-transparent animate-gradient-pan">
                      Sustainable Growth
                    </span>
                  </h1>
                  
                  <p className="text-xl lg:text-2xl text-slate-600 font-medium leading-relaxed max-w-xl">
                    Sustainable business growth comes from combining strategic vision with intelligent, data-driven systems. Let&apos;s engineer your future.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-5">
                    <button className="group relative px-10 py-5 bg-pink-500 text-white rounded-2xl font-black text-xl shadow-[0_20px_50px_rgba(236,72,153,0.3)] hover:shadow-[0_20px_60px_rgba(236,72,153,0.4)] transition-all duration-500 hover:-translate-y-2 flex items-center justify-center gap-3">
                      Start Discussion
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in">
                  {points.map((point, i) => (
                    <div 
                      key={point.title}
                      className="group p-8 rounded-[2rem] bg-white border border-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${point.gradient} flex items-center justify-center mb-6 shadow-xl ${point.shadow} group-hover:scale-110 transition-transform`}>
                        <point.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-3">{point.title}</h3>
                      <p className="text-slate-500 leading-relaxed font-semibold text-sm">{point.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Closing Thought */}
        <section className="py-24 bg-slate-900">
          <div className="w-full px-6 lg:px-12">
            <div className="max-w-[1400px] mx-auto">
              <div className="relative p-12 lg:p-20 rounded-[4rem] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 blur-[100px] rounded-full -z-10" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full -z-10" />
                
                <h2 className="text-4xl lg:text-6xl font-black text-white mb-8">Ready to unlock your potential?</h2>
                <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium">
                  We don&apos;t just talk about growth—we build the systems that make it inevitable.
                </p>
                <button className="px-12 py-6 bg-white text-slate-900 rounded-3xl font-black text-2xl hover:bg-pink-50 transition-colors shadow-2xl">
                  Connect With Us
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <ClientFooter />
    </div>
  );
}
