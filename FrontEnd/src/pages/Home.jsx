import {
  ArrowRightIcon,
  CheckIcon,
  CloudArrowUpIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: CloudArrowUpIcon,
    title: 'Intelligent Cloud Storage',
    description:
      'Upload and store your images with AI-powered organization and unlimited scalability.',
    gradient: 'from-blue-400 to-cyan-400',
  },
  {
    icon: FolderIcon,
    title: 'Smart Folder System',
    description:
      'Nested folder architecture with drag-and-drop functionality for seamless organization.',
    gradient: 'from-purple-400 to-pink-400',
  },
  {
    icon: MagnifyingGlassIcon,
    title: 'AI-Powered Search',
    description:
      'Find any file instantly with intelligent search that understands context and content.',
    gradient: 'from-teal-400 to-emerald-400',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Enterprise Security',
    description: 'Military-grade encryption with JWT authentication and zero-trust architecture.',
    gradient: 'from-orange-400 to-emerald-400',
  },
];

const stats = [
  { number: '10M+', label: 'Files Stored' },
  { number: '99.9%', label: 'Uptime' },
  { number: '150+', label: 'Countries' },
  { number: '24/7', label: 'Support' },
];

function AnimatedCounter({ end, duration = 2000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev >= end) {
          clearInterval(timer);
          return end;
        }
        return Math.min(prev + increment, end);
      });
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration]);

  return Math.floor(count);
}

export default function FileHiveHomepage() {
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">


      {/* Hero Section */}
      <section className="relative min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 min-h-[80vh] items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">
                  FEATURED WORK
                </div>
                <h1 className="text-[8rem] md:text-[12rem] font-black leading-none tracking-tighter text-gray-900">
                  FILE
                  <br />
                  HIVE
                </h1>
              </div>
            </div>

            {/* Right Content - Call to Action */}
            <div className="bg-white p-12 rounded-2xl shadow-lg space-y-8">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-emerald-500 leading-tight">
                  Let's create something special
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed">
                  If you've got files to organize, get started and let's revolutionize your
                  workflow!
                </p>
              </div>

              <div className="space-y-4">
                <Link
                  to="/signup"
                  className="block w-full py-4 bg-stone-900 text-white text-center font-bold tracking-wide hover:bg-stone-950 transition-colors rounded"
                >
                  START FREE TRIAL
                </Link>
                <Link
                  to="/login"
                  className="block w-full py-4 border border-gray-300 text-gray-700 text-center font-bold tracking-wide hover:border-gray-400 transition-colors rounded"
                >
                  ALREADY HAVE ACCOUNT?
                </Link>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">14</div>
                    <div className="text-xs text-gray-500">DAY TRIAL</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">FREE</div>
                    <div className="text-xs text-gray-500">NO CARD</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">24/7</div>
                    <div className="text-xs text-gray-500">SUPPORT</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-white" id="services" data-animate>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <div className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">
              THREE SERVICES DRIVE OUR WORK
            </div>
            <h2 className="text-6xl md:text-8xl font-black text-gray-900 mb-4">Our Core</h2>
            <h2 className="text-6xl md:text-8xl font-black text-gray-900">SERVICES</h2>
          </div>

          <div className="space-y-32">
            {/* Service 1 - Cloud Storage */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-3">
                <h3 className="text-5xl font-black text-gray-900">Cloud Storage</h3>
              </div>
              <div className="lg:col-span-5 space-y-6">
                <h4 className="text-xl font-bold text-gray-900">Intelligent File Management</h4>
                <p className="text-gray-700 leading-relaxed">
                  Secure file storage with AI-powered organization, unlimited scalability, and
                  seamless sync. Every file is precisely managed to create an intuitive storage
                  experience. The goal: a reliable system that stands out in any workflow.
                </p>
                <button className="inline-flex items-center text-sm font-bold tracking-[0.1em] text-gray-900 hover:text-emerald-500 transition-colors">
                  VIEW STORAGE PROJECTS
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </button>
              </div>
              <div className="lg:col-span-4">
                <div className="bg-emerald-500 aspect-square rounded-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <CloudArrowUpIcon className="w-16 h-16 mx-auto mb-4" />
                    <div className="text-3xl font-bold">CLOUD</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service 2 - Smart Organization */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-3">
                <h3 className="text-5xl font-black text-gray-900">Smart Organization</h3>
              </div>
              <div className="lg:col-span-5 space-y-6">
                <h4 className="text-xl font-bold text-gray-900">Folder & Search System</h4>
                <p className="text-gray-700 leading-relaxed">
                  From nested folder structures to AI-powered search, we combine intelligent
                  organization with intuitive user experiences. We prototype, iterate, and refine
                  every interaction to deliver seamless file management.
                </p>
                <button className="inline-flex items-center text-sm font-bold tracking-[0.1em] text-gray-900 hover:text-emerald-500 transition-colors">
                  VIEW ORGANIZATION FEATURES
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </button>
              </div>
              <div className="lg:col-span-4">
                <div className="bg-gray-900 aspect-square rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="text-center text-white z-10">
                    <FolderIcon className="w-16 h-16 mx-auto mb-4" />
                    <div className="text-3xl font-bold">ORGANIZE</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Showcase */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <div className="relative">
                <span className="text-[12rem] font-black text-gray-200 absolute -top-8 -left-4">
                  01
                </span>
                <div className="relative z-10 pt-32">
                  <h3 className="text-5xl font-black text-gray-900 mb-6">
                    FILEHIVE<sup className="text-2xl">®</sup>
                  </h3>
                  <div className="flex space-x-6 text-xs font-bold tracking-[0.1em] text-gray-500 uppercase">
                    <span>STORAGE</span>
                    <span>DESIGN</span>
                    <span>DEVELOPMENT</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-700 to-emerald-800 rounded-2xl p-12 text-white relative overflow-hidden min-h-[400px] flex flex-col justify-center">
              <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <CloudArrowUpIcon className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-3xl font-bold mb-2">Cloud Storage</h4>
                  <p className="text-teal-100 text-lg leading-relaxed">
                    Revolutionary file management with AI-powered organization and enterprise-grade
                    security.
                  </p>
                </div>
                <Link
                  to="/signup"
                  className="inline-block bg-white text-teal-600 px-6 py-3 font-bold rounded hover:bg-gray-100 transition-colors"
                >
                  TRY NOW
                </Link>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
                  {stat.number.includes('+') ? (
                    <>
                      <AnimatedCounter end={parseInt(stat.number)} />
                      {stat.number.slice(-1)}
                    </>
                  ) : (
                    stat.number
                  )}
                </div>
                <div className="text-sm font-medium text-gray-600 tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-32 bg-white" id="about">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                <span className="text-emerald-500">FILEHIVE®</span> is built for modern teams and
                supported by cutting-edge technology. It creates seamless digital experiences where
                powerful functionality meets intuitive design.
              </h2>
              <button className="inline-flex items-center px-6 py-3 bg-black text-white font-bold text-sm tracking-wide hover:bg-gray-800 transition-colors">
                ABOUT US
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </button>
            </div>

            <div className="bg-gray-100 p-8 space-y-8">
              <div className="bg-white p-6 rounded">
                <img
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop"
                  alt="Team collaboration"
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <div className="text-xs font-bold tracking-[0.1em] text-gray-500 uppercase mb-2">
                  OUR LATEST WORK
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">CLOUD STORAGE</h3>
                <p className="text-gray-600 text-sm mb-4">Modern file management solution</p>
                <Link
                  to="/signup"
                  className="inline-flex items-center text-sm font-bold tracking-[0.1em] text-gray-900 hover:text-emerald-500 transition-colors"
                >
                  GET STARTED
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Link>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold tracking-[0.1em] text-gray-500 uppercase mb-1">
                    Address
                  </div>
                  <div className="text-sm text-gray-900">
                    Cloud Infrastructure
                    <br />
                    Global Network
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold tracking-[0.1em] text-gray-500 uppercase mb-1">
                    Email
                  </div>
                  <div className="text-sm text-gray-900">hello@filehive.app</div>
                </div>
                <div className="flex space-x-4 pt-4">
                  <a
                    href="#"
                    className="text-xs font-bold tracking-[0.1em] text-gray-500 hover:text-emerald-500"
                  >
                    Instagram
                  </a>
                  <a
                    href="#"
                    className="text-xs font-bold tracking-[0.1em] text-gray-500 hover:text-emerald-500"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="#"
                    className="text-xs font-bold tracking-[0.1em] text-gray-500 hover:text-emerald-500"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter">Born to Organize</h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              File Management. Cloud Storage. AI Organization.
            </p>
          </div>

          <div className="space-y-8">
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Join thousands of professionals who've revolutionized their file management workflow.
              Start organizing smarter today.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Link
                to="/signup"
                className="inline-flex items-center px-8 py-4 bg-emerald-500 text-white font-bold text-lg hover:bg-emerald-600 transition-colors rounded"
              >
                Start Free Trial
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center text-white hover:text-emerald-400 font-semibold"
              >
                Already have an account?
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-12 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4" />
              14-day free trial
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
