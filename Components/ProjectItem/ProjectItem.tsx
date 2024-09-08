import Link from "next/link";

function ProjectItem(props: any) {
  const { title, image, description, detail, link } = props;

  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center">
      <div className="box-border flex flex-col items-center w-full max-w-md h-auto lg:h-[70vh] shadow-light-card dark:shadow-dark-card rounded-card mx-auto p-6 border-2 rounded bg-white dark:bg-gray-800">
        <Link href={link}>
          <img
            src={image}
            className="rounded-image mx-auto h-[20vh] w-[20vh] mt-5 shadow-light-button dark:shadow-dark-button hover:scale-105 transition-transform duration-300"
            alt={title}
          />
        </Link>
        <div className="text-left font-pixel mt-6">
          <h1 className="font-extrabold text-2xl text-center text-gray-800 dark:text-white">{title}</h1>
          <div className="font-about text-left text-sm mt-4 text-gray-600 dark:text-gray-300">{description}</div>
          <div className="font-about text-left text-sm mt-2 italic text-gray-500 dark:text-gray-400">{detail}</div>
        </div>
      </div>
    </div>
  );
}

export default ProjectItem;
