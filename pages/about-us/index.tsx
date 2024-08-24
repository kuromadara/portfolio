import { Fragment } from "react";
import Head from "next/head";
import NavigationButtons from "../../Components/NavigationButtons";

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
            <h1 className="text-5xl font-bold text-gray-800 mb-4">About Dayananda</h1>
            <p className="text-gray-600 text-xl mb-8">
              Discover my educational and professional journey
            </p>
          </div>
          <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 mb-8">
            <div className="text-gray-700 leading-relaxed">
              <h2 className="text-2xl font-bold mb-4">Education</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Bachelor in Computer Application</strong>
                  <br />
                  <a
                    href="https://cottonuniversity.ac.in/"
                    className="text-blue-500 hover:underline"
                  >
                    Dibrugarh University, Assam
                  </a>
                </li>
                <li>
                  <strong>Masters in Computer Application</strong>
                  <br />
                  <a
                    href="https://dibru.ac.in/"
                    className="text-blue-500 hover:underline"
                  >
                    Cotton University, Assam
                  </a>
                </li>
              </ul>
              <h2 className="text-2xl font-bold mb-4">Work Experience</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>A.I Intern</strong>
                  <br />
                  <a
                    href="https://iasst.gov.in/"
                    className="text-blue-500 hover:underline"
                  >
                    IASST, Guwahati (Internship)
                  </a>
                </li>
                <li>
                  <strong>Web Developer</strong>
                  <br />
                  <a
                    href="https://webcomindia.biz/"
                    className="text-blue-500 hover:underline"
                  >
                    Webcom India Pvt. Ltd.
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <NavigationButtons />
      </div>
    </Fragment>
  );
}

export default AboutUsPage;
