
import Link from "next/link";

const NavigationButtons = () => {

    return(
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <div className=" inline-block items-center">
          <Link href="/" className="items-center">
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
          <Link href="/about-us" className="items-center">
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
                
                    <a>About Me</a>
            </button>
        </Link>
        <Link href="/contact-us" className="items-center">
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
            
                <a>Contact Me</a>
          </button>
        </Link>
        </div>
      </div>
    );
}

export default NavigationButtons;