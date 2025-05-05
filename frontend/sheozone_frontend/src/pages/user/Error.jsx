const Error = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-light-gray">
      <h1 className="text-9xl mb-8 font-bold">404</h1>
      <h2 className="text-6xl font-medium">Page Not Found</h2>
      <p className="text-2xl mt-6">
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
};

export default Error;
