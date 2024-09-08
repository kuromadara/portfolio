import { Fragment } from "react";
import Head from "next/head";

function HomePage() {
  return (
    <Fragment>
      <Head>
        <title>Dayananda's Portfolio</title>
        <meta name="description" content="Welcome to Dayananda's portfolio website" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="bg-gradient-to-b from-background-light to-white dark:from-background-dark dark:to-gray-900 min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">
              Welcome to My Portfolio Test
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Fullstack Developer | Web & Mobile Specialist
            </p>
            <a href="/projects" className="bg-primary text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition duration-300">
              View My Projects
            </a>
          </div>
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 mb-8">
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <p className="mb-4">
                Hello, I'm Dayananda Dowarah, a passionate Fullstack Developer with expertise in web and
                mobile technologies. With a strong foundation in PHP, Laravel, and Flutter, I specialize
                in creating robust and user-friendly applications.
              </p>
              <p className="mb-4">
                My experience spans across developing enterprise-level software solutions, including ERP
                systems and management platforms for various sectors. I'm dedicated to crafting
                efficient, scalable, and innovative digital solutions that make a real impact.
              </p>
              <p className="mb-4">
                This portfolio website is built using Next.js, TypeScript, and Tailwind CSS, showcasing
                my commitment to modern and responsive web development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default HomePage;
