import NavigationButtons from "../../Components/NavigationButtons";
import ProjectItem from "../../Components/ProjectItem/ProjectItem";

function ProjectsPage() {

const PROJECTS = [
    {
        id: 1,
        title: 'Handwriting Recognition App',
        image: '/static/images/pngegg.png',
        description: "An Android app that can recognize on-screen handwriting and translate it to text.",
        detail: "Hello there, This was my 5th Semester project for MCA at Cotton University. The app uses android Canvas API to draw on the screen and then uses android Digital Ink Recognition model to recognize the drawn handwriting and translate it to text. The app is built using Kotlin and Android Studio.",
        link: 'https://github.com/kuromadara/HandwrittingRecognition'
    },
    {
        id: 2,
        title: 'Cervical Cancer Screening Web App',
        image: 'https://raw.githubusercontent.com/kuromadara/filehost/main/media/icons/cell.svg',
        description: "A Cervical cancer Screening app using Pap-Smear Slides",
        detail: "Hello there, This was my Thesis for MCA at Cotton University. The model for prediction was trained using Keras on top of tensorflow and the web app was built uising Django",
        link: 'https://github.com/kuromadara/cervical_classifier_webapp'
    },
    {
        id: 3,
        title: 'Tick-Tak-Toe',
        image: '/static/images/tic-tac-toe1.png',
        description: "A 2-Player CLI game of Tic-Tac-Toe",
        detail: "Hello there, This is just a simple game of Tic-Tac-Toe. The game can be played using the terminal or the command line. This was built using Python and just one external library to color the output in the terminal. The interesting part is unlike other tick-tak-toe games, the game is can be played on a board of NxN size.",
        link: 'https://github.com/kuromadara/code4fun'
    },
    
]
  return (
    <div className="bg-body h-auto">
        <div className="container mx-auto px-4 py-8 ">
          <h1 className="text-7xl font-bold text-center font-pixel">Projects</h1>
        <div className="grid place-content-center grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3">
          {     
                PROJECTS.map(project => (
                    <div className="" key={project.id}>
                    <ProjectItem 
                        key={project.id} 
                        title={project.title}
                        image={project.image}
                        description={project.description}
                        detail={project.detail}
                        link={project.link}
                    />
                    </div>
                ))
          }
          </div>
        </div>
        
        <NavigationButtons />
    </div>
  );
}

export default ProjectsPage;