import Head from "next/head";

const HeaderPage = () => {
  return (
    <Head>
      <title>My Portfolio</title>
      <meta name="description" content="Welcome to my portfolio website" />
      <link rel="icon" href="/favicon.ico" />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style>
        {`
          body {
            font-family: 'Poppins', sans-serif;
          }
        `}
      </style>
    </Head>
  );
};

export default HeaderPage;
