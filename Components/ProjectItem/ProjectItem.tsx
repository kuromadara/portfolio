import Link from "next/link";

function ProjectItem(props: any) {
  const { title, image, description, detail, link } = props;

  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center">
      <div className="box-border flex flex-col items-center w-full max-w-md h-auto lg:h-[70vh] shadow-light-card rounded-card mx-auto p-6 border-2 rounded">
        <Link href={link}>
          <img
            src={image}
            className="rounded-image mx-auto h-[20vh] w-[20vh] mt-5 shadow-light-button hover:scale-105 transition-transform duration-300"
            alt={title}
          />
        </Link>
        <div className="text-left font-pixel mt-6">
          <h1 className="font-extrabold text-2xl text-center">{title}</h1>
          <div className="font-about text-left text-sm mt-4">{description}</div>
          <div className="font-about text-left text-sm mt-2 italic">{detail}</div>
        </div>
      </div>
    </div>
  );
}

export default ProjectItem;
