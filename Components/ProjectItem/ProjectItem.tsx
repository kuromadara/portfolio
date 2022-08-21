
function ProjectItem(props: any) {

    const { title, image, description, detail} = props;
    return(
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="box-border flex flex-col items-center w-auto h-auto lg:h-[50vh] shadow-light-card rounded-card mx-auto p-4 border-2 rounded">
            <img
                src={image}
                className="rounded-image m-x-auto mt-5 shadow-light-button"
                alt={title}
            />
            <div className="text-left font-pixel">
                <h1 className="font-extrabold text-2xl text-center">{title}</h1>
                <div className="font-about text-left text-sm">{description}</div>
                <div className="font-about text-left text-sm">{detail}</div>
            </div>
          </div>
        </div>
    );
}

export default ProjectItem;