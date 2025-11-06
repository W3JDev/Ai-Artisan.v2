import React, { useState, useEffect, useRef, useMemo } from 'react';
import { InterestModal } from './InterestModal';
import { 
  BriefcaseIcon, SparklesIcon, DocumentMagnifyingGlassIcon, LightBulbIcon as FeatureLightBulbIcon, 
  ArrowTrendingUpIcon, ClockIcon, AcademicCapIcon, RocketLaunchIcon, UserGroupIcon, CogIcon,
  ChevronDoubleRightIcon, CheckBadgeIcon, ShieldCheckIcon, PresentationChartLineIcon,
  ArrowUpRightIcon,
  LinkedInIcon, 
  TwitterXIcon,
  GoogleIcon,
  MicrosoftIcon,
  AmazonIcon,
  MailIcon,
  PhoneIcon,
  LocationMarkerIcon,
  GlobeAltIcon,
} from './icons';

interface LandingPageProps {
  onInterestRegistered: () => void;
}

const RealisticResumePreview: React.FC = () => {
  return (
    <div className="hero-resume-preview group">
      <div className="resume-3d-mockup w-full max-w-lg h-auto bg-white/10 backdrop-blur-xl border border-white/10 rounded-lg p-6 shadow-3d transition-all duration-500 ease-out group-hover:shadow-3d-hover group-hover:scale-[1.02]">
        {/* Header */}
        <div className="text-center mb-5 pb-3 border-b border-slate-400/20">
          <div className="h-7 bg-slate-200/90 rounded w-3/4 mx-auto animate-pulse"></div>
          <div className="h-4 bg-sky-400/70 rounded w-1/2 mx-auto mt-2.5"></div>
        </div>

        <div className="flex gap-x-5">
          {/* Main Column (Left) */}
          <div className="w-[65%]">
            {/* Summary Section */}
            <div className="mb-5">
              <div className="h-4 bg-sky-500/60 rounded w-1/3 mb-2.5"></div>
              <div className="space-y-1.5">
                <div className="h-2 bg-slate-300/40 rounded w-full"></div>
                <div className="h-2 bg-slate-300/40 rounded w-full"></div>
                <div className="h-2 bg-slate-300/40 rounded w-5/6"></div>
              </div>
            </div>

            {/* Experience Section */}
            <div>
              <div className="h-4 bg-sky-500/60 rounded w-2/5 mb-3"></div>
              <div className="mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <div className="h-3 bg-slate-200/70 rounded w-1/2"></div>
                  <div className="h-2 bg-slate-400/50 rounded w-1/4"></div>
                </div>
                <div className="h-2.5 bg-slate-400/60 rounded w-1/3 mb-2"></div>
                <div className="space-y-1.5 pl-3">
                  <div className="h-2 bg-slate-300/40 rounded w-full"></div>
                  <div className="h-2 bg-slate-300/40 rounded w-11/12"></div>
                  <div className="h-2 bg-slate-300/40 rounded w-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column (Right) */}
          <div className="w-[35%] border-l border-slate-400/20 pl-5">
            {/* Contact Section */}
            <div className="mb-5">
              <div className="h-4 bg-sky-500/60 rounded w-1/2 mb-3"></div>
              <div className="space-y-2.5">
                <div className="flex items-center"><MailIcon className="w-4 h-4 text-slate-300/80 mr-2"/><div className="h-2 bg-slate-300/50 rounded w-full"></div></div>
                <div className="flex items-center"><PhoneIcon className="w-4 h-4 text-slate-300/80 mr-2"/><div className="h-2 bg-slate-300/50 rounded w-4/5"></div></div>
                <div className="flex items-center"><LinkedInIcon className="w-4 h-4 text-slate-300/80 mr-2"/><div className="h-2 bg-slate-300/50 rounded w-full"></div></div>
              </div>
            </div>

            {/* Skills Section */}
            <div>
              <div className="h-4 bg-sky-500/60 rounded w-1/2 mb-3"></div>
              <div className="flex flex-wrap gap-1.5">
                <div className="h-5 bg-sky-600/60 rounded-full w-1/3"></div>
                <div className="h-5 bg-sky-600/60 rounded-full w-2/5"></div>
                <div className="h-5 bg-sky-600/60 rounded-full w-1/2"></div>
                <div className="h-5 bg-sky-600/60 rounded-full w-1/3"></div>
                <div className="h-5 bg-sky-600/60 rounded-full w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const AnalysisScreenshotPreview: React.FC = () => (
  <div className="bg-dark-light/50 backdrop-blur-md border border-dark-lighter p-6 rounded-xl shadow-glass w-full max-w-md mx-auto">
    <h3 className="text-xl font-bold text-gray-200 mb-4 font-display">Job Match Analysis</h3>
    <div className="mb-5">
      <div className="flex justify-between items-baseline mb-1">
        <h4 className="font-semibold text-slate-300">Job Alignment Score</h4>
        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-sky-400">92%</span>
      </div>
      <div className="w-full bg-slate-600/50 rounded-full h-2.5">
        <div className="bg-gradient-to-r from-green-400 to-sky-400 h-2.5 rounded-full" style={{ width: '92%' }}></div>
      </div>
    </div>
    <div className="mb-5">
      <h4 className="font-semibold text-slate-300 mb-2">Alignment Strengths</h4>
      <ul className="space-y-1.5">
        <li className="flex items-start text-sm text-slate-400"><CheckBadgeIcon className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" /> Strong experience in React & TypeScript.</li>
        <li className="flex items-start text-sm text-slate-400"><CheckBadgeIcon className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" /> Proven track record in agile environments.</li>
      </ul>
    </div>
    <div>
      <h4 className="font-semibold text-slate-300 mb-2">Potential Gaps / Improvements</h4>
      <ul className="space-y-1.5">
        <li className="flex items-start text-sm text-slate-400"><FeatureLightBulbIcon className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0" /> Highlight experience with cloud platforms.</li>
      </ul>
    </div>
  </div>
);

const CompanyLogos: React.FC = () => (
  <div className="flex items-center justify-center gap-x-6 sm:gap-x-8 mt-4">
    <GoogleIcon className="h-6 text-slate-500 hover:text-slate-400 transition-colors" />
    <MicrosoftIcon className="h-6 text-slate-500 hover:text-slate-400 transition-colors" />
    <AmazonIcon className="h-7 text-slate-500 hover:text-slate-400 transition-colors" />
  </div>
);


interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  improvement?: string;
  animationClass?: string; // For keyframe animations like 'animate-slide-in-left'
  style?: React.CSSProperties; // For animation-delay for keyframe animations
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, improvement, animationClass, style }) => (
  <div 
    className={`bg-dark-light/50 backdrop-blur-md border border-dark-lighter p-6 rounded-xl shadow-glass transform hover:scale-105 transition-all duration-300 ease-out hover:shadow-xl ${animationClass ?? ''}`}
    style={style}
  >
    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-premium-gradient-from to-premium-gradient-to text-white rounded-lg mb-5 shadow-lg">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2 font-display text-sky-300">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed mb-3">{description}</p>
    {improvement && (
      <div className="mt-auto pt-3 border-t border-dark-lighter/50">
        <p className="text-sm font-semibold text-green-400 flex items-center">
          <ArrowUpRightIcon className="w-4 h-4 mr-1.5"/>
          {improvement}
        </p>
      </div>
    )}
  </div>
);

interface HowItWorksStepProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  observeRef?: (el: HTMLElement | null) => void;
  style?: React.CSSProperties; // For transition-delay
}

const HowItWorksStep: React.FC<HowItWorksStepProps> = ({ number, title, description, icon, observeRef, style }) => (
  <div 
    ref={observeRef}
    className="flex flex-col items-center text-center p-4 stats-reveal"
    style={style}
  >
    <div className="relative mb-4">
      <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-premium-gradient-from to-premium-gradient-to text-white rounded-full text-2xl font-bold font-display shadow-lg">
        {number}
      </div>
      <div className="absolute -top-2 -right-2 p-2 bg-dark-light rounded-full shadow-md border border-dark-lighter">
        {icon}
      </div>
    </div>
    <h4 className="text-lg font-semibold mb-1 text-sky-400">{title}</h4>
    <p className="text-slate-400 text-xs">{description}</p>
  </div>
);

interface BenefitItemProps {
  text: string;
  observeRef?: (el: HTMLElement | null) => void;
  style?: React.CSSProperties; // For transition-delay
}

const BenefitItem: React.FC<BenefitItemProps> = ({ text, observeRef, style }) => (
  <li 
    ref={observeRef}
    className="flex items-start mb-2 stats-reveal"
    style={style}
  >
    <CheckBadgeIcon className="w-5 h-5 text-green-400 mr-2.5 mt-0.5 flex-shrink-0" />
    <span className="text-slate-300">{text}</span>
  </li>
);

interface RoadmapItemProps {
  date: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'Done' | 'In Progress' | 'Planned';
  observeRef?: (el: HTMLElement | null) => void;
  style?: React.CSSProperties; // For transition-delay
}

const RoadmapItem: React.FC<RoadmapItemProps> = ({ date, title, description, icon, status, observeRef, style }) => {
  const statusColors = {
    Done: 'bg-green-500/80 text-green-50',
    'In Progress': 'bg-sky-500/80 text-sky-50',
    Planned: 'bg-slate-500/80 text-slate-100',
  };
  return (
    <div 
      ref={observeRef}
      className="relative pl-10 py-4 border-l-2 border-dark-lighter group stats-reveal"
      style={style}
    >
      <div className="absolute -left-[1.35rem] top-4 w-10 h-10 bg-dark-light border-2 border-dark-lighter rounded-full flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-premium-gradient-from group-hover:to-premium-gradient-to transition-all duration-300 text-white">
        {icon}
      </div>
      <span className={`absolute top-4 right-0 text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[status]}`}>{status}</span>
      <p className="text-xs text-sky-400 font-semibold mb-1">{date}</p>
      <h4 className="text-lg font-medium text-slate-100 mb-1">{title}</h4>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
};

const AnimatedCounter: React.FC<{ target: number }> = ({ target }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && ref.current) {
          let start = 0;
          const duration = 2000; 
          const end = target;
          const incrementTime = 50; 
          const totalSteps = duration / incrementTime;
          const incrementValue = Math.max(1, Math.floor(end / totalSteps));

          const timer = setInterval(() => {
            start += incrementValue;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, incrementTime);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) { // Ensure ref.current exists before trying to unobserve
        observer.unobserve(ref.current);
      }
    };
  }, [target]);

  return <span ref={ref} className="font-bold text-premium-gradient-from animate-count-up-number">{count.toLocaleString()}+</span>;
};


export const LandingPage: React.FC<LandingPageProps> = ({ onInterestRegistered }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const observedElementsRef = useRef<(HTMLElement | null)[]>([]); // Renamed for clarity

  useEffect(() => {
    document.body.classList.remove('bg-gray-100');
    document.body.classList.add('bg-dark', 'text-gray-200', 'antialiased');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            if (!entry.target.classList.contains('stats-reveal') && !entry.target.classList.contains('animate-slide-in-left')) { // Check for specific animation classes
                 entry.target.classList.remove('animate-on-scroll'); 
            }
            // observer.unobserve(entry.target); // Optional: unobserve after first animation
          }
        });
      },
      { threshold: 0.1 } 
    );

    observedElementsRef.current.forEach((element) => {
      if (element) {
        // Apply 'animate-on-scroll' only to elements not using 'stats-reveal' or other specific animation classes handled by is-visible.
        if (!element.classList.contains('stats-reveal') && !element.classList.contains('animate-slide-in-left')) { 
            element.classList.add('animate-on-scroll');
        }
        observer.observe(element);
      }
    });

    return () => {
      observedElementsRef.current.forEach((element) => {
        if (element) observer.unobserve(element);
      });
    };
  }, []); // Empty dependency array means this runs once on mount and cleanup on unmount
  
  const addToObservedElements = (el: HTMLElement | null) => { // Renamed for clarity
    if (el && !observedElementsRef.current.includes(el)) {
      observedElementsRef.current.push(el);
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSuccessfulRegistration = (name: string, email: string) => {
    console.log(`User ${name} (${email}) interest registered.`);
    onInterestRegistered(); 
    handleCloseModal();
  };
  
  const shareUrl = encodeURIComponent('https://ai-resume-artisan.example.dev'); // Replace with actual URL
  const shareText = encodeURIComponent('Craft your professional resume in minutes with AI Resume Artisan! Leveraging Google Gemini for tailored, ATS-friendly results. #AI #ResumeBuilder #JobSearch');
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#roadmap', label: 'Roadmap' },
  ];

  const featureData = [
    { icon: <SparklesIcon className="w-6 h-6" />, title: "AI-Powered Generation", description: "Transform raw notes or existing documents into polished, ATS-friendly resumes and compelling cover letters using advanced AI.", improvement: "+75% Faster Creation"},
    { icon: <BriefcaseIcon className="w-6 h-6" />, title: "Intelligent Tailoring", description: "Provide a job description, and our AI tailors your resume content, highlighting relevant skills and experiences for each specific role.", improvement: "Up to 3x Relevance"},
    { icon: <DocumentMagnifyingGlassIcon className="w-6 h-6" />, title: "In-Depth Job Match Analysis", description: "Get a clear job alignment score, see your resume's strengths, and identify potential gaps compared to the job requirements.", improvement: "95% Gap Detection"},
    { icon: <FeatureLightBulbIcon className="w-6 h-6" />, title: "Actionable AI Suggestions", description: "For every identified gap, receive smart, AI-generated suggestions. Apply them with a click to instantly improve your resume.", improvement: "+25pt Score Boost"}
  ];


  return (
    <div className="bg-dark min-h-screen text-gray-200 font-sans">
      <style>{`
        .hero-resume-preview {
          perspective: 1500px;
        }
        .resume-3d-mockup {
          transform: rotateX(10deg) rotateY(-8deg) rotateZ(1deg);
          will-change: transform, box-shadow;
        }
        .hero-resume-preview:hover .resume-3d-mockup {
          transform: rotateX(5deg) rotateY(-3deg) rotateZ(0deg) scale(1.03);
        }
      `}</style>

      <nav className="sticky top-0 z-50 bg-dark/70 backdrop-blur-lg shadow-xl">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#" className="text-2xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
            AI Resume Artisan
          </a>
          <div className="hidden md:flex space-x-6 items-center">
            {navLinks.map(link => (
              <a key={link.label} href={link.href} className="text-slate-300 hover:text-highlight transition-colors duration-200">{link.label}</a>
            ))}
            <button
              onClick={handleOpenModal}
              className="cta-premium-shimmer bg-gradient-to-r from-premium-gradient-from to-premium-gradient-to hover:shadow-lg text-white font-semibold py-2.5 px-6 rounded-lg shadow-md transition-all duration-300 hover:scale-105"
            >
              Get Started Free
            </button>
          </div>
          <div className="md:hidden">
             <button onClick={handleOpenModal} className="cta-premium-shimmer bg-gradient-to-r from-premium-gradient-from to-premium-gradient-to hover:shadow-lg text-white font-semibold py-2 px-4 rounded-lg shadow-sm text-sm">
              Try Free
            </button>
          </div>
        </div>
      </nav>

      <header ref={addToObservedElements} className="pt-24 pb-20 md:pt-32 md:pb-28 bg-dark text-center overflow-hidden">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div className="md:text-left animate-fade-in-up"> {/* This uses Tailwind animation directly */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display mb-6 text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-400 to-indigo-400 leading-tight">
              Craft Your Future: <br/>AI-Powered Resumes That <span className="underline decoration-sky-500/70 decoration-4 underline-offset-8">Open Doors</span>.
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-xl mx-auto md:mx-0 mb-8" style={{animationDelay: '0.2s'}}>
              Leverage Google Gemini to transform your experience into a compelling, ATS-friendly resume and cover letter. Achieve <strong className="text-sky-300">73% faster interview booking</strong> with AI insights and tailored content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start" style={{animationDelay: '0.4s'}}>
              <button
                onClick={handleOpenModal}
                className="cta-premium-shimmer bg-gradient-to-r from-premium-gradient-from to-premium-gradient-to hover:shadow-lg text-white font-bold py-3.5 px-8 text-lg rounded-lg shadow-cta transition-all duration-300 hover:scale-105"
              >
                Get Started Free (Beta)
              </button>
              <a
                href="#features" 
                className="bg-dark-light/50 hover:bg-dark-light/80 border border-dark-lighter text-slate-200 font-semibold py-3.5 px-8 text-lg rounded-lg shadow-md transition-all duration-300 hover:scale-105 hover:border-sky-500/50 flex items-center justify-center"
              >
                See Success Stories
                <ChevronDoubleRightIcon className="w-5 h-5 ml-2 opacity-70"/>
              </a>
            </div>
          </div>
          <div className="hidden md:block animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <RealisticResumePreview />
          </div>
        </div>
      </header>

      <section ref={addToObservedElements} className="py-16 bg-dark-light">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold font-display mb-4 text-sky-400">Feeling Overwhelmed by the Job Hunt?</h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto mb-10">
            Generic resumes get ignored. Manual tailoring is exhausting. ATS systems are unforgiving. It's time for a smarter approach.
            <br/> <strong className="text-highlight">AI Resume Artisan is your intelligent career co-pilot.</strong>
          </p>
        </div>
      </section>

      <section ref={addToObservedElements} id="features" className="py-20 bg-dark">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-bold font-display text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Why AI Resume Artisan is Your Ultimate Career Tool</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featureData.map((feature, index) => (
               <FeatureCard 
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                improvement={feature.improvement}
                animationClass="animate-slide-in-left" // Use Tailwind animation class directly
                style={{animationDelay: `${index * 0.1}s`}}
              />
            ))}
          </div>
        </div>
      </section>

      <section ref={addToObservedElements} className="py-20 bg-dark-light">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-bold font-display text-center mb-16 text-sky-400">Launch Your Next Career Move in Minutes</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 items-start">
            <HowItWorksStep observeRef={addToObservedElements} number="1" title="Input Your Story" description="Paste resume details or jot down notes." icon={<CogIcon className="w-6 h-6 text-sky-300"/>} style={{transitionDelay: '0s'}}/>
            <HowItWorksStep observeRef={addToObservedElements} number="2" title="Target Your Role" description="Add job description for AI tailoring & analysis." icon={<DocumentMagnifyingGlassIcon className="w-6 h-6 text-sky-300"/>} style={{transitionDelay: '0.1s'}}/>
            <HowItWorksStep observeRef={addToObservedElements} number="3" title="AI Perfects & Analyzes" description="Our AI crafts your resume, providing key insights." icon={<SparklesIcon className="w-6 h-6 text-sky-300"/>} style={{transitionDelay: '0.2s'}}/>
            <HowItWorksStep observeRef={addToObservedElements} number="4" title="Apply with Confidence" description="Download PDF, copy text, and secure interviews!" icon={<RocketLaunchIcon className="w-6 h-6 text-sky-300"/>} style={{transitionDelay: '0.3s'}}/>
          </div>
        </div>
      </section>

      <section ref={addToObservedElements} className="py-20 bg-dark">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div ref={addToObservedElements} className="stats-reveal">
              <h2 className="text-3xl lg:text-4xl font-bold font-display mb-6 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Unlock Your Career Potential, Faster</h2>
              <p className="text-slate-300 mb-8 leading-relaxed">AI Resume Artisan isn't just about creating documents; it's about empowering you with the tools and insights to navigate the job market effectively and confidently.</p>
              <ul className="space-y-2.5">
                <BenefitItem observeRef={addToObservedElements} text="Save countless hours on resume and cover letter writing." style={{transitionDelay: '0.1s'}}/>
                <BenefitItem observeRef={addToObservedElements} text="Boost ATS pass rates with optimized formatting & keywords." style={{transitionDelay: '0.2s'}} />
                <BenefitItem observeRef={addToObservedElements} text="Apply to more jobs, tailored perfectly, with significantly less effort." style={{transitionDelay: '0.3s'}}/>
                <BenefitItem observeRef={addToObservedElements} text="Gain unshakable confidence with AI-driven feedback and strategic insights." style={{transitionDelay: '0.4s'}}/>
                <BenefitItem observeRef={addToObservedElements} text="Make a lasting professional impression, every single time." style={{transitionDelay: '0.5s'}}/>
              </ul>
            </div>
            <div ref={addToObservedElements} className="hidden md:block stats-reveal" style={{transitionDelay: '0.2s'}}>
              <AnalysisScreenshotPreview />
            </div>
          </div>
        </div>
      </section>

      <section ref={addToObservedElements} id="pricing" className="py-20 bg-dark-light">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-bold font-display text-center mb-4 text-sky-400">Simple, Transparent Access to Premium Tools</h2>
           <p className="text-center text-slate-400 max-w-2xl mx-auto mb-12">
            Start for free during our Beta phase and experience the full power of AI-driven career advancement.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-dark p-8 rounded-xl shadow-2xl border-2 border-premium-gradient-from/70 flex flex-col relative overflow-hidden animate-pulse-subtle"> {/* animate-pulse-subtle is a keyframe animation */}
              <div className="absolute top-0 right-0 m-3 px-3 py-1 bg-gradient-to-r from-premium-gradient-from to-premium-gradient-to text-white text-xs font-semibold rounded-full shadow-lg">
                Most Popular
              </div>
              <h3 className="text-2xl font-semibold font-display mb-2 text-highlight">Beta Access</h3>
              <p className="text-5xl font-extrabold mb-1">$0 <span className="text-xl font-normal text-slate-400">/ Forever Free</span></p>
              <p className="text-sm text-slate-300 mb-6">Currently in open beta. All core features are free to use!</p>
              <ul className="space-y-2.5 text-sm text-slate-300 mb-8 flex-grow">
                {[
                  "Full Resume & Cover Letter Generation",
                  "AI Job Description Tailoring",
                  "AI Job Match Analysis & Insights",
                  "Actionable AI Gap Suggestions",
                  "Multiple Templates & Font Choices",
                  "Unlimited PDF Downloads & Text Copy"
                ].map(item => (
                  <li key={item} className="flex items-center"><CheckBadgeIcon className="w-5 h-5 text-green-400 mr-2 flex-shrink-0"/> {item}</li>
                ))}
              </ul>
               <p className="text-sm text-center text-slate-400 mb-4">Investment: <span className="font-semibold text-green-400">$0 (Beta)</span> → Average career outcome: <span className="font-semibold text-green-400">Unlock Your Potential!</span></p>
              <button
                onClick={handleOpenModal}
                className="cta-premium-shimmer w-full bg-gradient-to-r from-premium-gradient-from to-premium-gradient-to hover:shadow-xl text-white font-semibold py-3.5 px-6 rounded-lg shadow-cta transition-all duration-300 hover:scale-105 text-lg"
              >
                Register Interest & Try Now
              </button>
            </div>

            <div className="bg-dark p-8 rounded-xl shadow-xl border border-dark-lighter flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-2xl font-semibold font-display text-sky-300">Premium Pro</h3>
                <span className="text-xs bg-sky-700/80 text-sky-200 px-2.5 py-1 rounded-full font-semibold shadow">COMING SOON</span>
              </div>
              <p className="text-5xl font-extrabold mb-1 text-slate-500">$X <span className="text-xl font-normal text-slate-400">/ month (est.)</span></p>
              <p className="text-sm text-slate-400 mb-6">Unlock advanced features, deeper insights, and unlimited potential.</p>
              <ul className="space-y-2.5 text-sm text-slate-400 mb-8 flex-grow">
                 {[
                  "All Beta Features, Plus:",
                  "Unlimited Resumes & Version History",
                  "Exclusive Advanced Templates & Customization",
                  "Priority AI Processing & Support",
                  "In-depth Career Analytics (Future)",
                  "More AI Integrations (e.g., LinkedIn Sync)"
                ].map(item => (
                  <li key={item} className="flex items-center"><CogIcon className="w-5 h-5 text-slate-500 mr-2 flex-shrink-0"/> {item}</li>
                ))}
              </ul>
              <div className="text-sm text-center text-slate-500 mb-4 mt-auto">
                <p>Trusted by professionals at top companies.</p>
                <CompanyLogos />
              </div>
              <button
                onClick={handleOpenModal} 
                className="w-full bg-dark-light hover:bg-dark-lighter border border-dark-lighter text-sky-300/80 font-semibold py-3.5 px-6 rounded-lg transition-colors duration-300"
              >
                Notify Me When Available
              </button>
            </div>
          </div>
           <div ref={addToObservedElements} className="text-center mt-12 stats-reveal" style={{transitionDelay: '0.2s'}}>
            <p className="text-2xl text-slate-300 font-display">
              Join <AnimatedCounter target={15000} /> ambitious professionals already advancing their careers!
            </p>
          </div>
        </div>
      </section>

      <section ref={addToObservedElements} id="roadmap" className="py-20 bg-dark">
        <div className="container mx-auto px-6">
            <h2 className="text-3xl lg:text-4xl font-bold font-display text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Our Journey & Your Future Success</h2>
            <div className="max-w-3xl mx-auto space-y-2">
                <RoadmapItem 
                    observeRef={addToObservedElements}
                    date="Q3 2024" 
                    title="Official Launch & Core Enhancements" 
                    description="Public launch with current feature set stabilization. More resume templates and font choices added. Performance tuning."
                    icon={<RocketLaunchIcon className="w-5 h-5"/>} 
                    status="In Progress"
                    style={{transitionDelay: '0s'}}
                />
                <RoadmapItem 
                    observeRef={addToObservedElements}
                    date="Q4 2024" 
                    title="LinkedIn Integration & User Accounts" 
                    description="Allow direct import of LinkedIn profile data. Introduce basic user accounts for saving work and preferences (requires backend)."
                    icon={<UserGroupIcon className="w-5 h-5"/>} 
                    status="Planned"
                    style={{transitionDelay: '0.1s'}}
                />
                 <RoadmapItem 
                    observeRef={addToObservedElements}
                    date="2025" 
                    title="Advanced Analytics & Premium Features" 
                    description="Detailed insights on resume performance (requires data consent & backend). Rollout of Premium Pro tier with exclusive features and deeper AI analysis."
                    icon={<ArrowTrendingUpIcon className="w-5 h-5"/>} 
                    status="Planned"
                    style={{transitionDelay: '0.2s'}}
                />
                 <RoadmapItem 
                    observeRef={addToObservedElements}
                    date="Beyond 2025" 
                    title="AI Interview Prep & Team Features" 
                    description="Generate potential interview questions based on resume/JD. Features for career coaches or organizational use."
                    icon={<AcademicCapIcon className="w-5 h-5"/>} 
                    status="Planned"
                    style={{transitionDelay: '0.3s'}}
                />
            </div>
        </div>
      </section>

      <section ref={addToObservedElements} className="py-20 md:py-28 bg-gradient-to-br from-premium-gradient-from to-premium-gradient-to text-center">
        <div ref={addToObservedElements} className="container mx-auto px-6 stats-reveal"> {/* This div has stats-reveal, ensure it's observed */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display mb-6 text-white">Ready to Elevate Your Job Application?</h2>
          <p className="text-lg sm:text-xl text-indigo-100 max-w-xl mx-auto mb-10">
            Join thousands of smart job seekers. Let AI Resume Artisan craft your path to success. Don't just apply, <span className="font-semibold">impress</span>.
          </p>
          <button
            onClick={handleOpenModal}
            className="cta-premium-shimmer bg-white hover:bg-slate-50 text-premium-gradient-to font-bold py-4 px-12 text-xl rounded-lg shadow-2xl transition-all duration-300 hover:scale-105 transform"
          >
            Try AI Resume Artisan Now
          </button>
        </div>
      </section>

      <footer className="py-12 bg-dark-light">
        <div className="container mx-auto px-6 text-center">
           <div className="flex justify-center items-center space-x-6 mb-6">
              <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter" className="text-slate-400 hover:text-highlight transition-colors">
                <TwitterXIcon className="w-5 h-5" />
              </a>
              <a href={linkedinShareUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" className="text-slate-400 hover:text-highlight transition-colors">
                <LinkedInIcon className="w-5 h-5" />
              </a>
            </div>
          <p className="text-slate-400 text-sm mb-3">
            &copy; {new Date().getFullYear()} AI Resume Artisan. All rights reserved. Built with ❤️ & AI.
          </p>
          <div className="space-x-4">
            <a href="#privacy" onClick={(e) => {e.preventDefault(); alert("Privacy Policy: Your data is processed locally and for API calls. Interest form data goes to Google Forms.")}} className="text-xs text-slate-500 hover:text-highlight transition-colors">Privacy Policy</a>
            <a href="#terms" onClick={(e) => {e.preventDefault(); alert("Terms of Service: Use responsibly. AI output requires review.")}} className="text-xs text-slate-500 hover:text-highlight transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {isModalOpen && (
        <InterestModal
          onClose={handleCloseModal}
          onSuccess={handleSuccessfulRegistration}
        />
      )}
    </div>
  );
};