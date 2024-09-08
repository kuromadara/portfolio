import { Fragment } from "react";
import ProjectItem from "../../Components/ProjectItem/ProjectItem";
import Head from "next/head";

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
        detail: "Hello there, This was my Thesis for MCA at Cotton University. I developed this PoC as an Intern at IASST, Guwahati. The model for prediction was trained using Keras on top of tensorflow and the web app was built uising Django",
        link: 'https://github.com/kuromadara/cervical_classifier_webapp'
    },
    {
        id: 3,
        title: 'Tick-Tac-Toe',
        image: '/static/images/tic-tac-toe1.png',
        description: "A 2-Player CLI game of Tic-Tac-Toe",
        detail: "Hello there, This is just a simple game of Tic-Tac-Toe. The game can be played using the terminal or the command line. This was built using Python and just one external library to color the output in the terminal. The interesting part is unlike other tick-tak-toe games, it can be played on a board of NxN size.",
        link: 'https://github.com/kuromadara/code4fun'
    },
    {
        id: 4,
        title: 'Direct Caller with Sim Choice',
        image: '/static/images/phone.png',
        description: "A Flutter library that allows you to make phone calls directly from your app.",
        detail: "Makes Call Directly without user interaction. Ideal for application that has emergency call services. One example would be a distress app that makes phone call when phone is shaked three times.",
        link: 'https://github.com/kuromadara/direct_caller_sim_choice'
    },
    {
      id: 5,
      title: 'Indian Currency to Word',
      image: '/static/images/rupee.png',
      description: "A Flutter library that convert number to words in Indian Currency",
      detail: "A Flutter package for both iOS and Android that converts a given amount to word in Indian Locale. Currently it support conversion till Crore. The maximum number is (999999999). ",
      link: 'https://github.com/kuromadara/indian_currency_to_word'
    },
    {
      id: 6,
      title: 'TinyChat',
      image: '/static/images/chat.png',
      description: "Experience seamless, private, and offline AI-powered conversations with TinyChat, running TinyLLaMA locally on your device.",
      detail: "Unleash the power of AI on your device with TinyChat! Experience seamless, intelligent conversations with our app that runs TinyLLaMA locally, ensuring privacy, speed, and offline capability. Whether you need assistance, want to have a friendly chat, or seek information, TinyChat is here to help anytime, anywhere. ",
      link: 'https://github.com/kuromadara/tinychat/releases'
    },
    
    
]
function ProjectsPage() {

return (
  <Fragment>
    <Head>
      <title>Dayananda's Projects</title>
      <meta name="description" content="Explore Dayananda's portfolio projects" />
      <link rel="icon" href="/favicon.ico" />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </Head>
    <div className="bg-gradient-to-b from-background-light to-white dark:from-background-dark dark:to-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">My Projects</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Explore the diverse range of projects I've worked on
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((project) => (
            <div key={project.id} className="transform hover:scale-105 transition duration-300">
              <ProjectItem
                title={project.title}
                image={project.image}
                description={project.description}
                detail={project.detail}
                link={project.link}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  </Fragment>
);

}

export default ProjectsPage;