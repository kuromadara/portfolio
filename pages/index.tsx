import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Navigation from '../Components/Navigation';
import { sanityClient } from '../lib/sanity';

interface Project {
  _id: string;
  title: string;
  description: string;
  image: {
    asset: {
      _ref: string;
      url: string;
    };
  };
  technologies: string[];
  projectUrl?: string;
  githubUrl?: string;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const query = `*[_type == "project"] {
          _id,
          title,
          description,
          image {
            asset-> {
              _ref,
              url
            }
          },
          technologies,
          projectUrl,
          githubUrl
        }`;
        const data = await sanityClient.fetch(query);
        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.2 }
    );

    Object.values(sectionsRef.current).forEach(section => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const typewriterText = "Full Stack Developer | DevOps | AI/ML Enthusiast";
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isDeleting && currentIndex < typewriterText.length) {
        setDisplayText(prev => prev + typewriterText[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      } else if (isDeleting && currentIndex > 0) {
        setDisplayText(prev => prev.slice(0, -1));
        setCurrentIndex(currentIndex - 1);
      } else if (currentIndex === typewriterText.length) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (currentIndex === 0 && isDeleting) {
        setIsDeleting(false);
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, typewriterText]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Head>
        <title>Dayananda Dowarah - Full Stack Developer | DevOps | AI/ML</title>
        <meta name="description" content="Full Stack Developer with 3+ years of experience in Laravel, Flutter, DevOps, and AI/ML integration. Building scalable web and mobile applications." />
        <meta name="keywords" content="Full Stack Developer, Laravel, Flutter, DevOps, AI/ML, React, Next.js, Guwahati" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dayananda-portfolio.vercel.app/" />
        <meta property="og:title" content="Dayananda Dowarah - Full Stack Developer" />
        <meta property="og:description" content="Full Stack Developer with 3+ years of experience in Laravel, Flutter, DevOps, and AI/ML integration." />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Dayananda Dowarah - Full Stack Developer" />
        <meta property="twitter:description" content="Full Stack Developer with 3+ years of experience in Laravel, Flutter, DevOps, and AI/ML integration." />
      </Head>

      {/* Particle Background */}
      <div className="particles-bg"></div>

      <Navigation />

      {/* Hero Section */}
      <section 
        id="home" 
        ref={el => sectionsRef.current.home = el}
        className="min-h-screen flex items-center justify-center relative pt-16"
      >
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className={`space-y-8 ${visibleSections.has('home') ? 'animate-fade-in' : 'opacity-0'}`}>
            {/* Name */}
            <h1 className="text-6xl md:text-8xl font-heading font-black gradient-text-glow">
              Dayananda Dowarah
            </h1>
            
            {/* Location */}
            <p className="text-xl text-foreground-muted flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Guwahati, India
            </p>

            {/* Typewriter Title */}
            <div className="h-16 flex items-center justify-center">
              <h2 className="text-2xl md:text-3xl font-heading font-semibold text-foreground">
                {displayText}
                <span className="border-r-2 border-primary animate-pulse ml-1"></span>
              </h2>
            </div>

            {/* Contact Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
              <a href="mailto:dowarah.dayananda35@gmail.com" 
                 className="glass-card px-6 py-3 flex items-center gap-2 hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Email
              </a>
              <a href="https://github.com/dayananda35" target="_blank" rel="noopener noreferrer"
                 className="glass-card px-6 py-3 flex items-center gap-2 hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
                GitHub
              </a>
              <a href="/static/docs/My_CV-2.pdf" download
                 className="glass-card px-6 py-3 flex items-center gap-2 bg-primary/10 border-primary/30 hover:bg-primary/20 text-primary transition-all hover:scale-105">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download Resume
              </a>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
              <div className="flex flex-col items-center text-primary cursor-pointer" 
                   onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}>
                <span className="text-sm mb-2">Scroll to explore</span>
                <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section - Interactive Timeline */}
      <section 
        id="experience" 
        ref={el => sectionsRef.current.experience = el}
        className="py-20 relative"
      >
        <div className="container mx-auto px-6">
          <div className={`text-center mb-16 ${visibleSections.has('experience') ? 'animate-slide-up' : 'opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-heading font-bold gradient-text mb-4">Experience</h2>
            <p className="text-xl text-foreground-muted">My professional journey in tech</p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full timeline-line"></div>

            {/* Experience Items */}
            <div className="space-y-16">
              {/* Sunishchit Technovations */}
              <div className={`flex items-center ${visibleSections.has('experience') ? 'animate-slide-in-left' : 'opacity-0'}`}>
                <div className="w-1/2 pr-8 text-right">
                  <div className="glass-card p-6 hover:scale-105 transition-transform">
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <span className="text-sm px-3 py-1 bg-primary/20 text-primary rounded-full">Current</span>
                      <h3 className="text-xl font-heading font-bold text-primary">Full Stack Developer</h3>
                    </div>
                    <h4 className="text-lg font-semibold mb-2">Sunishchit Technovations Pvt. Ltd.</h4>
                    <p className="text-foreground-muted mb-4">Feb 2025 – Present</p>
                    <div className="space-y-2 text-sm">
                      <p>• Integrated Land Records Management System</p>
                      <p>• e-Khajana Government Revenue System</p>
                      <p>• Dharitree Environmental Platform</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4 justify-end">
                      <span className="px-2 py-1 bg-accent/20 text-accent rounded text-xs">CodeIgniter</span>
                      <span className="px-2 py-1 bg-accent/20 text-accent rounded text-xs">PostgreSQL</span>
                      <span className="px-2 py-1 bg-accent/20 text-accent rounded text-xs">Flask</span>
                      <span className="px-2 py-1 bg-accent/20 text-accent rounded text-xs">JavaScript</span>
                    </div>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                <div className="w-1/2 pl-8"></div>
              </div>

              {/* Web.com India */}
              <div className={`flex items-center ${visibleSections.has('experience') ? 'animate-slide-in-right' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
                <div className="w-1/2 pr-8"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent rounded-full border-4 border-background"></div>
                <div className="w-1/2 pl-8">
                  <div className="glass-card p-6 hover:scale-105 transition-transform">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-heading font-bold text-accent">Full Stack Developer</h3>
                    </div>
                    <h4 className="text-lg font-semibold mb-2">Web.com (India) Pvt. Ltd.</h4>
                    <p className="text-foreground-muted mb-4">Nov 2021 – Feb 2025</p>
                    <div className="space-y-2 text-sm">
                      <p>• Built Laravel + Flutter applications</p>
                      <p>• Implemented multi-auth systems & REST APIs</p>
                      <p>• Dockerized applications & CI/CD pipelines</p>
                      <p>• Firebase integration & cloud deployment</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">Laravel</span>
                      <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">Flutter</span>
                      <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">Docker</span>
                      <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">Firebase</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* IASST Research */}
              <div className={`flex items-center ${visibleSections.has('experience') ? 'animate-slide-in-left' : 'opacity-0'}`} style={{animationDelay: '0.4s'}}>
                <div className="w-1/2 pr-8 text-right">
                  <div className="glass-card p-6 hover:scale-105 transition-transform">
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <span className="text-sm px-3 py-1 bg-accent-secondary/20 text-accent-secondary rounded-full">Research</span>
                      <h3 className="text-xl font-heading font-bold text-accent-secondary">Research Intern</h3>
                    </div>
                    <h4 className="text-lg font-semibold mb-2">IASST (Indian Association for the Cultivation of Science and Technology)</h4>
                    <p className="text-foreground-muted mb-4">2020 – 2021</p>
                    <div className="space-y-2 text-sm">
                      <p>• Deep learning for cervical cancer detection</p>
                      <p>• Django-based diagnostic application</p>
                      <p>• MobileNet v2 implementation</p>
                      <p>• Medical image processing & analysis</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4 justify-end">
                      <span className="px-2 py-1 bg-accent-tertiary/20 text-accent-tertiary rounded text-xs">Python</span>
                      <span className="px-2 py-1 bg-accent-tertiary/20 text-accent-tertiary rounded text-xs">Django</span>
                      <span className="px-2 py-1 bg-accent-tertiary/20 text-accent-tertiary rounded text-xs">TensorFlow</span>
                      <span className="px-2 py-1 bg-accent-tertiary/20 text-accent-tertiary rounded text-xs">ML</span>
                    </div>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent-secondary rounded-full border-4 border-background"></div>
                <div className="w-1/2 pl-8"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education */}
      <section 
        id="education" 
        ref={el => sectionsRef.current.education = el}
        className="py-20 relative"
      >
        <div className="container mx-auto px-6">
          <div className={`text-center mb-16 ${visibleSections.has('education') ? 'animate-slide-up' : 'opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-heading font-bold gradient-text mb-4">Education</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className={`glass-card p-8 text-center hover:scale-105 transition-transform ${visibleSections.has('education') ? 'animate-scale-in' : 'opacity-0'}`}>
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
              </div>
              <h3 className="text-xl font-heading font-bold mb-2">MCA</h3>
              <p className="text-foreground-muted mb-2">Cotton College State University</p>
              <p className="text-sm text-primary">2021 • 75%</p>
            </div>

            <div className={`glass-card p-8 text-center hover:scale-105 transition-transform ${visibleSections.has('education') ? 'animate-scale-in' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-bold mb-2">BCA</h3>
              <p className="text-foreground-muted mb-2">Dibrugarh University</p>
              <p className="text-sm text-accent">2019</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Skills */}
      <section 
        id="skills" 
        ref={el => sectionsRef.current.skills = el}
        className="py-20 relative"
      >
        <div className="container mx-auto px-6">
          <div className={`text-center mb-16 ${visibleSections.has('skills') ? 'animate-slide-up' : 'opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-heading font-bold gradient-text mb-4">Technical Skills</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Languages */}
            <div className={`glass-card p-6 ${visibleSections.has('skills') ? 'animate-slide-in-left' : 'opacity-0'}`}>
              <h3 className="text-xl font-heading font-bold mb-4 text-primary">Languages</h3>
              <div className="space-y-3">
                {['Dart', 'PHP', 'C#', 'SQL', 'Bash', 'Python', 'JavaScript'].map((skill, idx) => (
                  <div key={skill} className="flex items-center justify-between">
                    <span>{skill}</span>
                    <div className="w-20 h-2 bg-glass rounded-full overflow-hidden">
                      <div className={`h-full bg-primary rounded-full transition-all duration-1000 ${visibleSections.has('skills') ? 'w-full' : 'w-0'}`} 
                           style={{animationDelay: `${idx * 0.1}s`}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Frameworks */}
            <div className={`glass-card p-6 ${visibleSections.has('skills') ? 'animate-slide-up' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
              <h3 className="text-xl font-heading font-bold mb-4 text-accent">Frameworks & Tools</h3>
              <div className="flex flex-wrap gap-2">
                {['Laravel', 'Flutter', 'React', 'Next.js', 'Django', 'CodeIgniter'].map((skill) => (
                  <span key={skill} className="px-3 py-2 bg-accent/20 text-accent rounded-lg text-sm border border-accent/30 hover:bg-accent/30 transition-colors">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* DevOps & Cloud */}
            <div className={`glass-card p-6 ${visibleSections.has('skills') ? 'animate-slide-in-right' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
              <h3 className="text-xl font-heading font-bold mb-4 text-accent-secondary">DevOps & Cloud</h3>
              <div className="flex flex-wrap gap-2">
                {['Docker', 'Digital Ocean', 'CI/CD', 'Apache', 'Nginx', 'Linux', 'Firebase'].map((skill) => (
                  <span key={skill} className="px-3 py-2 bg-accent-secondary/20 text-accent-secondary rounded-lg text-sm border border-accent-secondary/30 hover:bg-accent-secondary/30 transition-colors">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Work & Achievements */}
      <section 
        id="achievements" 
        ref={el => sectionsRef.current.achievements = el}
        className="py-20 relative"
      >
        <div className="container mx-auto px-6">
          <div className={`text-center mb-16 ${visibleSections.has('achievements') ? 'animate-slide-up' : 'opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-heading font-bold gradient-text mb-4">Featured Work</h2>
            <p className="text-xl text-foreground-muted">Highlights of my professional achievements</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Flutter Package 1 */}
            <div className={`glass-card p-6 hover:scale-105 transition-all group ${visibleSections.has('achievements') ? 'animate-scale-in' : 'opacity-0'}`}>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-bold mb-2">Indian Currency to Word</h3>
              <p className="text-foreground-muted text-sm mb-3">Flutter package for converting numbers to Indian currency words</p>
              <div className="flex items-center justify-between">
                <span className="text-primary font-bold">2.5k+ downloads</span>
                <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">Flutter Package</span>
              </div>
            </div>

            {/* ML Project */}
            <div className={`glass-card p-6 hover:scale-105 transition-all group ${visibleSections.has('achievements') ? 'animate-scale-in' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
              <div className="w-12 h-12 bg-accent-secondary/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-accent-secondary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-bold mb-2">Cervical Cancer Detection</h3>
              <p className="text-foreground-muted text-sm mb-3">AI model using MobileNet v2 for medical diagnosis</p>
              <div className="flex items-center justify-between">
                <span className="text-accent-secondary font-bold">Research Project</span>
                <span className="px-2 py-1 bg-accent-secondary/20 text-accent-secondary rounded text-xs">AI/ML</span>
              </div>
            </div>

            {/* GovTech Systems */}
            <div className={`glass-card p-6 hover:scale-105 transition-all group ${visibleSections.has('achievements') ? 'animate-scale-in' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-bold mb-2">GovTech Systems</h3>
              <p className="text-foreground-muted text-sm mb-3">e-Khajana, Dharitree & Land Records Management systems</p>
              <div className="flex items-center justify-between">
                <span className="text-accent font-bold">Government Scale</span>
                <span className="px-2 py-1 bg-accent/20 text-accent rounded text-xs">Enterprise</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section 
        id="projects" 
        ref={el => sectionsRef.current.projects = el}
        className="py-20 relative"
      >
        <div className="container mx-auto px-6">
          <div className={`text-center mb-16 ${visibleSections.has('projects') ? 'animate-slide-up' : 'opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-heading font-bold gradient-text mb-4">Projects</h2>
            <p className="text-xl text-foreground-muted">Some of my personal work</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {projects.map((project, index) => (
              <div key={project._id} 
                   className={`glass-card overflow-hidden hover:scale-105 transition-all group ${visibleSections.has('projects') ? 'animate-fade-in' : 'opacity-0'}`}
                   style={{animationDelay: `${index * 0.1}s`}}>
                {project.image?.asset?.url && (
                  <div className="h-48 bg-background-secondary overflow-hidden">
                    <img 
                      src={project.image.asset.url} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-foreground-muted text-sm mb-4 line-clamp-3">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies?.map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-primary/20 text-primary rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    {project.projectUrl && (
                      <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" 
                         className="flex-1 text-center py-2 bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors">
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" 
                         className="flex-1 text-center py-2 bg-glass border border-glass-border rounded hover:border-primary/30 transition-colors">
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section 
        id="contact" 
        ref={el => sectionsRef.current.contact = el}
        className="py-20 relative"
      >
        <div className="container mx-auto px-6">
          <div className={`text-center mb-16 ${visibleSections.has('contact') ? 'animate-slide-up' : 'opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-heading font-bold gradient-text mb-4">Let's Connect</h2>
            <p className="text-xl text-foreground-muted">Ready to build something amazing together?</p>
          </div>

          <div className={`max-w-2xl mx-auto text-center ${visibleSections.has('contact') ? 'animate-scale-in' : 'opacity-0'}`}>
            <div className="glass-card p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-4 text-lg">
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <a href="mailto:dowarah.dayananda35@gmail.com" className="hover:text-primary transition-colors">
                    dowarah.dayananda35@gmail.com
                  </a>
                </div>

                <div className="flex items-center justify-center gap-4 text-lg">
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>Guwahati, India</span>
                </div>

                <div className="pt-6">
                  <a href="mailto:dowarah.dayananda35@gmail.com" 
                     className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:scale-105 font-semibold">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Get In Touch
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-glass-border">
        <div className="container mx-auto px-6">
          <p className="text-foreground-muted">
            © 2024 Dayananda Dowarah. Built with Next.js & Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}