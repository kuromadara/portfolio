import { Fragment } from "react";
import Head from "next/head";

function ContactUsPage() {
  return (
    <Fragment>
      <Head>
        <title>Contact Dayananda</title>
        <meta name="description" content="Get in touch with Dayananda Dowarah, a Fullstack Developer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-background-light via-primary-50 to-secondary-500/5 dark:from-background-dark dark:via-surface-dark dark:to-secondary-500/5 pt-16">
        {/* Hero Section */}
        <div className="py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20 animate-fade-in">
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium mb-4">
                  📬 Contact Me
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
                <span className="gradient-text">Let's Connect</span>
              </h1>
              <p className="text-xl text-muted-light dark:text-muted-dark mb-8 max-w-3xl mx-auto leading-relaxed">
                I'd love to hear from you! Feel free to reach out for any inquiries or collaboration opportunities.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Contact Form */}
                <div className="animate-slide-up">
                  <div className="glass rounded-2xl p-8 hover-glow">
                    <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-6">
                      Send me a message
                    </h2>
                    <form className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                          Full Name
                        </label>
                        <input 
                          type="text" 
                          id="name" 
                          name="name" 
                          className="w-full px-4 py-3 rounded-lg bg-surface-light dark:bg-surface-dark border border-primary-500/20 text-text-light dark:text-text-dark placeholder-muted-light dark:placeholder-muted-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                          Email Address
                        </label>
                        <input 
                          type="email" 
                          id="email" 
                          name="email" 
                          className="w-full px-4 py-3 rounded-lg bg-surface-light dark:bg-surface-dark border border-primary-500/20 text-text-light dark:text-text-dark placeholder-muted-light dark:placeholder-muted-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                          Message
                        </label>
                        <textarea 
                          id="message" 
                          name="message" 
                          rows={6} 
                          className="w-full px-4 py-3 rounded-lg bg-surface-light dark:bg-surface-dark border border-primary-500/20 text-text-light dark:text-text-dark placeholder-muted-light dark:placeholder-muted-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 resize-none"
                          placeholder="Tell me about your project or just say hello!"
                        ></textarea>
                      </div>
                      <button 
                        type="submit" 
                        className="w-full px-6 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:shadow-glow hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        Send Message
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </button>
                    </form>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
                  <div className="glass rounded-2xl p-8 hover-glow">
                    <h2 className="text-2xl font-semibold text-text-light dark:text-text-dark mb-6">
                      Contact Information
                    </h2>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-muted-light dark:text-muted-dark">Email</p>
                          <a 
                            href="mailto:dowarah.dayananda35@gmail.com" 
                            className="text-text-light dark:text-text-dark hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
                          >
                            dowarah.dayananda35@gmail.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-accent-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-muted-light dark:text-muted-dark">Phone</p>
                          <a 
                            href="tel:+917002613213" 
                            className="text-text-light dark:text-text-dark hover:text-secondary-600 dark:hover:text-secondary-400 font-medium transition-colors"
                          >
                            +91-7002613213
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="glass rounded-2xl p-8 hover-glow">
                    <h3 className="text-xl font-semibold text-text-light dark:text-text-dark mb-4">
                      Let's connect on
                    </h3>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-accent-500 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.478.099.12.112.225.085.347-.09.402-.297 1.394-.336 1.595-.051.666-.415.402-.415.402-1.999-.916-3.256-3.796-3.256-6.114 0-4.784 3.473-9.177 10.021-9.177 5.262 0 9.355 3.75 9.355 8.770 0 5.23-3.299 9.434-7.868 9.434-1.536 0-2.983-.8-3.474-1.756l-.943 3.607c-.341 1.31-1.263 2.947-1.881 3.947 1.417.434 2.938.663 4.512.663 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ContactUsPage;
