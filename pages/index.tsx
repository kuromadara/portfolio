import { Fragment } from "react";
import NavigationButtons from '../Components/NavigationButtons'


function HomePage() {
  return (
    <Fragment>
      
      <div className="bg-body h-fullscreen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-9xl font-bold text-center font-cursive">Hola!</h1>
          <div className="text-3xl text-center font-pixel">
            Dayananda here.
          </div>
          
        </div>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="box-border w-card shadow-light-card rounded-card mx-auto p-4 border-2 rounded">
            <div className="text-center font-pixel">
              Hello I'm Dayananda Dowarah a Backend Developer 
              at <a href="https://webcomindia.biz/">Webcom India Pvt. Ltd.</a> Specializing in PHP and Laravel.        
            </div>
            <div className="text-center font-pixel">
              I have been mostly developing HRMIS softwares and Management Systems for colleges and universities.
              <br/>
              I also help in maintaining and developing Apps for our clients.
            </div>
          </div>
        </div>
        <NavigationButtons/>
      </div>

      
    </Fragment>
  );
}

export default HomePage;