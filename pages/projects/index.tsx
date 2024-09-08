import { Fragment } from "react";
import Head from "next/head";
import ProjectItem from "../../Components/ProjectItem/ProjectItem";
import sanityClient from '../../lib/sanity';
import { GetStaticProps } from 'next';

interface Project {
  _id: string;
  title: string;
  image: {
    asset: {
      url: string;
    };
  };
  description: string;
  detail: string;
  link: string;
}

interface ProjectsPageProps {
  projects: Project[];
}

export const getStaticProps: GetStaticProps<ProjectsPageProps> = async () => {
  try {
    console.log("Sanity client config:", sanityClient.config());
    
    const projects = await sanityClient.fetch(`
      *[_type == "project"] {
        _id,
        title,
        "image": image.asset->url,
        description,
        detail,
        link
      }
    `);

    console.log("Fetched projects:", projects);
    console.log("Number of projects:", projects.length);

    return {
      props: {
        projects: projects || [],
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return {
      props: {
        projects: [],
      },
      revalidate: 60,
    };
  }
};

function ProjectsPage({ projects }: ProjectsPageProps) {
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
            {projects.map((project) => (
              <div key={project._id} className="transform hover:scale-105 transition duration-300">
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