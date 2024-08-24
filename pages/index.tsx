import { Fragment } from "react";
import NavigationButtons from "../Components/NavigationButtons";
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
        <style>
          {`
            body {
              font-family: 'Poppins', sans-serif;
            }
          `}
        </style>
      </Head>
      <div className="bg-gray-100 min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Welcome to Dayananda's Portfolio
            </h1>
            <p className="text-gray-600 text-xl mb-8">
              Discover my journey as a Fullstack Developer
            </p>
          </div>
          <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 mb-8">
            <div className="text-gray-700 leading-relaxed">
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
                I also help in maintaining and developing Apps for our clients. For this portfolio
                website, I've used Next.js, TypeScript, and Tailwind CSS to create a modern and
                responsive user interface.
              </p>
            </div>
          </div>
        </div>
        <NavigationButtons />
      </div>
    </Fragment>
  );
}

export default HomePage;
