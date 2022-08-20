// import '../styles/globals.css'

import Link from "next/link";

function NavigationButtons()  {

    return(
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <div className=" inline-block items-center">
          <Link href="/">
            <button
              className="
                box-border  
                rounded-button 
                rounded
                h-[50px]
                w-button 
                m-2 
                shadow-light-button 
                text-light-font 
                font-extrabold 
                text-sm 
                focus:outline-none 
                active:shadow-none 
                transition-shadow ease-in-out duration-100"
            >
                <a>Home</a>
            </button>
          </Link>
          <button
            className="
              rounded-button 
              h-[50px]
              w-button 
              m-2 
              shadow-light-button 
              text-light-font 
              font-extrabold 
              text-sm 
              focus:outline-none 
              active:shadow-none 
              transition-shadow ease-in-out duration-100"
          >
            <Link href="/about-us">
                <a>About Me</a>
            </Link>
          </button>
          <button
            className="
              rounded-button 
              h-[50px]
              w-button 
              m-2 
              shadow-light-button 
              text-light-font 
              font-extrabold 
              text-sm 
              focus:outline-none 
              active:shadow-none 
              transition-shadow ease-in-out duration-100"
          >
            <Link href="/contact-us">
                <a>Contact Me</a>
            </Link>
          </button>
        </div>
      </div>
    );
}

export default NavigationButtons;