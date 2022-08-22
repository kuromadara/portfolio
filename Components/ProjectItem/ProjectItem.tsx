import Link from "next/link";

function ProjectItem(props: any) {

    const { title, image, description, detail, link} = props;
    return(
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="box-border flex flex-col items-center w-auto h-auto lg:h-[70vh] shadow-light-card rounded-card mx-auto p-4 border-2 rounded">
            <Link href={link}>
                <img
                    src={image}
                    className="rounded-image m-x-auto h-[20vh] w-[20vh] mt-5 shadow-light-button"
                    alt={title}
                />
            </Link>
            <div className="text-left font-pixel">
                <h1 className="font-extrabold text-2xl text-center">{title}</h1>
                <br/>
                <strong>
                    <div className="font-about text-left text-sm">{description}</div>
                </strong>
                
                <em>
                    <div className="font-about text-left text-sm mt-2">{detail}</div>
                </em>
                    
            </div>
          </div>
        </div>
    );
}

export default ProjectItem;