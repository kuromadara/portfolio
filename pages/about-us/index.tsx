import { Fragment } from "react";
import Head from "next/head";

function AboutUsPage() {
  return (
    <Fragment>
      <Head>
        <title>About Dayananda</title>
        <meta name="description" content="Learn more about Dayananda Dowarah, a passionate Fullstack Developer" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="bg-gradient-to-b from-background-light to-white dark:from-background-dark dark:to-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">About Me</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Discover my educational and professional journey
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Education</h2>
              <div className="space-y-6">
                {[
                  { degree: "Masters in Computer Application", institution: "Cotton University, Assam", year: "2020-2022" },
                  { degree: "Bachelor in Computer Application", institution: "Dibrugarh University, Assam", year: "2017-2020" },
                ].map((edu, index) => (
                  <div key={index} className="flex items-center">
                    <div className="bg-primary text-white rounded-full p-3 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{edu.degree}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{edu.institution}</p>
                      <p className="text-gray-500 dark:text-gray-400">{edu.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Work Experience</h2>
              <div className="space-y-6">
                {[
                  { position: "Web Developer", company: "Webcom India Pvt. Ltd.", period: "2022-Present" },
                  { position: "A.I Intern", company: "IASST, Guwahati", period: "2021-2022" },
                ].map((work, index) => (
                  <div key={index} className="flex items-center">
                    <div className="bg-secondary text-white rounded-full p-3 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{work.position}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{work.company}</p>
                      <p className="text-gray-500 dark:text-gray-400">{work.period}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default AboutUsPage;
