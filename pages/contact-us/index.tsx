import { Fragment } from "react";
import Head from "next/head";
import Link from "next/link";
import NavigationButtons from "../../Components/NavigationButtons";

function ContactUsPage() {
  return (
    <Fragment>
      <Head>
        <title>Contact Dayananda</title>
        <meta name="description" content="Get in touch with Dayananda Dowarah, a Fullstack Developer" />
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
            <h1 className="text-5xl font-bold text-gray-800 mb-4">Contact Dayananda</h1>
            <p className="text-gray-600 text-xl mb-8">
              Get in touch with me for any inquiries or collaboration opportunities
            </p>
          </div>
          <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 mb-8">
            <div className="text-gray-700 leading-relaxed">
              <h2 className="text-2xl font-bold mb-4">Email</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <a
                    href="mailto:dowarah.dayananda35@gmail.com"
                    className="text-blue-500 hover:underline"
                  >
                    dowarah.dayananda35@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:dowa.daya@gmail.com"
                    className="text-blue-500 hover:underline"
                  >
                    dowa.daya@gmail.com
                  </a>
                </li>
              </ul>
              <h2 className="text-2xl font-bold mb-4">Phone</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <a
                    href="https://wa.me/+917002613213?text=Hey Dayananda"
                    className="text-blue-500 hover:underline"
                  >
                    +91-7002613213
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+918486926661"
                    className="text-blue-500 hover:underline"
                  >
                    +91-8486926661
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

export default ContactUsPage;
