import { Fragment } from "react";
import Head from "next/head";

function AboutUsPage() {
  return (
    <Fragment>
      <Head>
        <title>About Dayananda</title>
        <meta name="description" content="Learn more about Dayananda Dowarah, a passionate Fullstack Developer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-background-light via-primary-50 to-secondary-500/5 dark:from-background-dark dark:via-surface-dark dark:to-secondary-500/5 pt-16">
        {/* Hero Section */}
        <div className="py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20 animate-fade-in">
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium mb-4">
                  👨‍💻 About Me
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
                <span className="gradient-text">My Journey</span>
              </h1>
              <p className="text-xl text-muted-light dark:text-muted-dark mb-8 max-w-3xl mx-auto leading-relaxed">
                Discover my educational background and professional experience
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              {/* Education Section */}
              <div className="mb-20 animate-slide-up">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-light dark:text-text-dark mb-4">
                    Education
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {[
                    { degree: "Masters in Computer Application", institution: "Cotton University, Assam", year: "2020-2022" },
                    { degree: "Bachelor in Computer Application", institution: "Dibrugarh University, Assam", year: "2017-2020" },
                  ].map((edu, index) => (
                    <div key={index} className="group animate-slide-up" style={{animationDelay: `${index * 0.2}s`}}>
                      <div className="glass rounded-2xl p-6 hover-glow h-full">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                              {edu.degree}
                            </h3>
                            <p className="text-muted-light dark:text-muted-dark mb-1">{edu.institution}</p>
                            <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{edu.year}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Work Experience Section */}
              <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-light dark:text-text-dark mb-4">
                    Work Experience
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-secondary-500 to-accent-500 mx-auto rounded-full"></div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {[
                    { position: "Web Developer", company: "Webcom India Pvt. Ltd.", period: "2022-Present" },
                    { position: "A.I Intern", company: "IASST, Guwahati", period: "2021-2022" },
                  ].map((work, index) => (
                    <div key={index} className="group animate-slide-up" style={{animationDelay: `${0.6 + index * 0.2}s`}}>
                      <div className="glass rounded-2xl p-6 hover-glow h-full">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-accent-500 rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-2 group-hover:text-secondary-600 dark:group-hover:text-secondary-400 transition-colors">
                              {work.position}
                            </h3>
                            <p className="text-muted-light dark:text-muted-dark mb-1">{work.company}</p>
                            <p className="text-sm text-secondary-600 dark:text-secondary-400 font-medium">{work.period}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default AboutUsPage;
