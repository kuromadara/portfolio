import { Fragment } from "react";
import NavigationButtons from '../Components/NavigationButtons'
import Head from "next/head";


function HomePage() {
  return (
    <Fragment>
      <Head>
        <title>Welcome</title>
      </Head>
      <div className="bg-body w-auto lg:h-fullscreen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-9xl font-bold text-center font-cursive">Hola!</h1>
          <div className="text-3xl text-center font-pixel">
            Dayananda here.
          </div>
          
        </div>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="box-border lg:w-card w-auto shadow-light-card rounded-card mx-auto p-4 border-2 rounded">
            
            <div className="text-center font-pixel">
            Hello, I'm Dayananda Dowarah, a passionate Fullstack Developer with expertise in web and mobile technologies. With a strong foundation in PHP, Laravel, and Flutter, I specialize in creating robust and user-friendly applications. My experience spans across developing enterprise-level software solutions, including ERP systems and management platforms for various sectors. I'm dedicated to crafting efficient, scalable, and innovative digital solutions that make a real impact.
              <br/>
              I also help in maintaining and developing Apps for our clients.
              <br/> 
              {/* However I thought of doing something new this time around. So I used 
              <br/>
              <strong>
                 Next.js and typescript and Tailwind css for the UI.
              </strong>
              <br/>
              Hope you will like this. */}
              
            </div>
          </div>
        </div>
        <NavigationButtons/>
      </div>

      
    </Fragment>
  );
}

export default HomePage;