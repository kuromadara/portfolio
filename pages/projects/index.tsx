import NavigationButtons from "../../Components/NavigationButtons";
import ProjectItem from "../../Components/ProjectItem/ProjectItem";

function ProjectsPage() {

const PROJECTS = [
    {
        id: 1,
        title: 'Cervical Cancer Screening',
        image: 'https://raw.githubusercontent.com/kuromadara/filehost/main/media/icons/cell.svg',
        description: "A Cervical cancer Screening app using Pap-Smear Slides",
        detail: "Hello there, This was my Thesis for MCA at Cotton University. The model for prediction was trained using Keras on top of tensorflow and the web app was built uising Django",
    },
    {
        id: 2,
        title: 'Tick-Tak-Toe',
        image: '/static/images/tic-tac-toe.png',
        description: "A Cervical cancer Screening app using Pap-Smear Slides",
        detail: "Hello there, This was my Thesis for MCA at Cotton University. The model for prediction was trained using Keras on top of tensorflow and the web app was built uising Django",
    },
    {
        id: 3,
        title: 'Tick-Tak-Toe',
        image: '/static/images/pngegg.png',
        description: "A Cervical cancer Screening app using Pap-Smear Slides",
        detail: "Hello there, This was my Thesis for MCA at Cotton University. The model for prediction was trained using Keras on top of tensorflow and the web app was built uising Django",
    },
    {
        id: 4,
        title: 'Tick-Tak-Toe',
        image: 'https://randomuser.me/api/portraits/women/81.jpg',
        description: "A Cervical cancer Screening app using Pap-Smear Slides",
        detail: "Hello there, This was my Thesis for MCA at Cotton University. The model for prediction was trained using Keras on top of tensorflow and the web app was built uising Django",
    }
]
  return (
    <div className="bg-body h-auto">
        <div className="container mx-auto px-4 py-8 ">
          <h1 className="text-7xl font-bold text-center font-pixel">Projects</h1>
        <div className="grid place-content-center grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-4">
          {     
                PROJECTS.map(project => (
                    <div className="" key={project.id}>
                    <ProjectItem 
                        key={project.id} 
                        title={project.title}
                        image={project.image}
                        description={project.description}
                        detail={project.detail}
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