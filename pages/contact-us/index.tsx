import { Fragment } from "react";
import Head from "next/head";
import Link from "next/link";


import NavigationButtons from "../../Components/NavigationButtons";

function ContactUsPage() {
    return (
        <Fragment>
      <Head>
        <title>Contact Me</title>
      </Head>
      <div className="bg-body w-auto h-fullscreen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-6xl lg:text-7xl font-bold text-center font-pixel">Contact Me</h1>
          
        </div>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="box-border w-auto lg:w-card lg:h-card h-auto shadow-light-card rounded-card mx-auto p-4 border-2 rounded">
            <div className="text-left font-pixel">
              Email:
              <br/>
              <ul className="px-4 text-sm lg:text-base">
                <div className="px-2">
                    <li className="list-disc">
                        <em>
                            <strong className="font-about">
                                <Link href="mailto:dowarah.dayananda35@gmail.com">
                                    dowarah.dayananda35@gmail.com
                                </Link></strong>
                        </em>
                    <br/>
                    </li>
                </div>
                <div className="px-2">
                    <li className="list-disc">
                        <em>
                            <strong className="font-about">
                                <Link href="mailto:dowa.daya@gmail.com">
                                    dowa.daya@gmail.com
                                </Link>
                            </strong>
                        </em>
                    <br/>
                </li>
                </div>
              </ul>
            </div>
            <div className="text-left font-pixel">
              Phone:
              <br/>
              <ul className="px-4 text-sm lg:text-base">
                <div className="px-2">
                    <li className="list-disc">
                        <em>
                            <strong className="font-about">
                                <Link href="https://wa.me/+917002613213?text=Hey Dayananda">
                                    +91-7002613213
                                </Link>
                            </strong>
                        </em>
                    <br/>
                    </li>
                </div>
                <div className="px-2">
                    <li className="list-disc">
                        <em>
                            <strong className="font-about">
                                <Link href="tel:+918486926661">
                                    +91-8486926661
                                </Link>
                            </strong>
                        </em>
                    <br/>
                    </li>
                </div>
              </ul>
            </div>
          </div>
        </div>
        <NavigationButtons/>
      </div>
    </Fragment>
    );
}

export default ContactUsPage;