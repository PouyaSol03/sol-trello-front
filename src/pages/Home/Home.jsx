const Home = () => {
  return (
    <>
      <div className="w-full min-h-screen">
        <div className="w-full h-screen flex justify-center items-center">
          <a
            href="/login"
            className="w-32 h-12 bg-blue-500 rounded-lg text-white font-bold flex justify-center items-center cursor-pointer"
            style={{ fontFamily: "iransans" }}
          >
            وارد شوید
          </a>
        </div>
      </div>
    </>
  );
};

export { Home };
