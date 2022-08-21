import { Fragment } from "react";
import Head from "next/head";

import NavigationButtons from "../../Components/NavigationButtons";

function AboutUsPage() {
  return (
    <Fragment>
      <Head>
        <title>About Us</title>
      </Head>
      <div className="bg-body h-fullscreen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-7xl font-bold text-center font-pixel">About Me</h1>
          
        </div>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="box-border lg:w-card w-auto h-auto lg:h-card shadow-light-card rounded-card mx-auto p-4 border-2 rounded">
            <div className="text-left font-pixel">
              Education:
              <br/>
              <ul className="px-4">
                <li className="list-disc">
                  <strong>Bachelor in Computer Application</strong>
                  <br/>
                  <small>
                    <em>
                      <strong className="font-about">
                        <a href="https://cottonuniversity.ac.in/">
                          Cotton University, Assam
                        </a>
                      </strong>
                    </em>
                  </small>
                </li>
                <li className="list-disc">
                  <strong>Masters in Computer Application</strong>
                  <br/>
                  <small>
                    <em>
                      <strong className="font-about">
                        <a href="https://dibru.ac.in/">
                          Dibrugarh University, Assam
                        </a>
                      </strong>
                    </em>
                  </small>
                </li>
              </ul>
            </div>
            <div className="text-left font-pixel">
              Work Experience:
              <br/>
              <ul className="px-4">
                <li className="list-disc">
                  <strong>Web Developer</strong>
                  <br/>
                  <small>
                    <em>
                      <strong className="font-about">
                        <a href="https://webcomindia.biz/">
                          Webcom India Pvt. Ltd.
                        </a>
                      </strong>
                    </em>
                  </small>
                </li>
                
              </ul>
            </div>
          </div>
        </div>
        <NavigationButtons/>
      </div>
    </Fragment>
  );
}

export default AboutUsPage;

        