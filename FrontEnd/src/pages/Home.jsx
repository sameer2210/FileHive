// www.futurethree.studio/
https: import {
  ArrowRightIcon,
  CheckIcon,
  ChevronRightIcon,
  CloudArrowUpIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  PlayIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: CloudArrowUpIcon,
    title: 'Cloud Storage',
    description: 'Upload and store your images securely in the cloud with unlimited access.',
  },
  {
    icon: FolderIcon,
    title: 'Nested Folders',
    description: 'Organize your files with nested folder structure, just like Google Drive.',
  },
  {
    icon: MagnifyingGlassIcon,
    title: 'Smart Search',
    description: 'Quickly find your images with our powerful search functionality.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure Access',
    description: 'Your data is protected with JWT authentication and user-specific access.',
  },

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
    gradient: 'from-green-400 to-emerald-400',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Enterprise Security',
    description: 'Military-grade encryption with JWT authentication and zero-trust architecture.',
    gradient: 'from-orange-400 to-red-400',
  },
];

const stats = [
  { number: '10M+', label: 'Files Stored' },
  { number: '99.9%', label: 'Uptime' },
  { number: '150+', label: 'Countries' },
  { number: '24/7', label: 'Support' },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Creative Director',
    company: 'Design Studio Pro',
    content:
      'FileHive revolutionized our workflow. The nested folders and search functionality saved us countless hours.',
    avatar: '',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Tech Lead',
    company: 'StartupTech',
    content:
      'The security features and API integration made FileHive the perfect choice for our growing team.',
    avatar: '',
  },
  {
    name: 'Emma Thompson',
    role: 'Photographer',
    company: 'Freelance',
    content:
      'Finally, a storage solution that understands creatives. The UI is beautiful and incredibly intuitive.',
    avatar: '',
  },
];

function AnimatedCounter({ end, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const { token } = useSelector(state => state.auth);

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

function GlowingButton({ children, variant = 'primary', className = '', ...props }) {
  const baseClasses =
    'relative overflow-hidden px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 group';
  const variants = {
    primary:
      'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-blue-500/25',
    secondary: 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20',
    outline: 'border-2 border-current text-gray-900 hover:bg-gray-900 hover:text-white',
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </button>
  );
}

export default function FileHiveHomepage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-tr from-cyan-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm text-gray-600 mb-6">
              <SparklesIcon className="w-4 h-4 text-blue-500" />
              Introducing FileHive 2.0 - Next-gen Cloud Storage
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 mb-8 leading-tight">
            File Storage
            <br />
            <span className="text-5xl md:text-7xl">Reimagined</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience the future of cloud storage with AI-powered organization, lightning-fast
            search, and enterprise-grade security.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-16">
            <GlowingButton variant="primary">
              Start Free Trial
              <ArrowRightIcon className="w-5 h-5" />
            </GlowingButton>
            <GlowingButton variant="secondary">
              <PlayIcon className="w-5 h-5" />
              Watch Demo
            </GlowingButton>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number.includes('+') ? (
                    <>
                      <AnimatedCounter end={parseInt(stat.number)} />
                      {stat.number.slice(-1)}
                    </>
                  ) : (
                    stat.number
                  )}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">FileHive</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Your personal cloud storage solution. Upload, organize, and manage your images with
            nested folders and powerful search capabilities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!token ? (
              <>
                <Link to="/signup" className="btn btn-primary text-lg px-8 py-3">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-secondary text-lg px-8 py-3">
                  Sign In
                </Link>
              </>
            ) : (
              <Link to="/dashboard" className="btn btn-primary text-lg px-8 py-3">
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative" id="features" data-animate>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Built for the
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {' '}
                Future
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every feature designed with cutting-edge technology and user experience in mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-8 rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                  isVisible.features ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{feature.description}</p>

                  <button className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Learn more
                    <ChevronRightIcon className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Trusted by
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                {' '}
                Professionals
              </span>
            </h2>
            <p className="text-xl text-gray-600">See what our users are saying about FileHive</p>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-white rounded-2xl p-8 shadow-lg text-center max-w-3xl mx-auto">
                      <div className="text-6xl mb-6">{testimonial.avatar}</div>
                      <blockquote className="text-xl text-gray-700 mb-6 leading-relaxed">
                        "{testimonial.content}"
                      </blockquote>
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-gray-600">
                          {testimonial.role} at {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial
                      ? 'bg-blue-600 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  onClick={() => setActiveTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black/20" />
          <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-8">
            Ready to Transform Your
            <br />
            File Management?
          </h2>
          <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto leading-relaxed">
            Join thousands of professionals who've revolutionized their workflow with FileHive.
            Start your free trial today—no credit card required.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <GlowingButton variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100">
              Start Free Trial
              <ArrowRightIcon className="w-5 h-5" />
            </GlowingButton>
            <button className="text-white hover:text-gray-200 font-semibold underline underline-offset-4">
              Schedule a Demo
            </button>
          </div>

          <div className="flex items-center justify-center gap-8 mt-12 text-sm opacity-75">
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

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

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

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
