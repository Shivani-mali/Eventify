const Home = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-3xl">
        <h1 className="text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6 transition-colors duration-300">
          Build the next big thing at <span className="text-blue-600">Hackathon</span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-light transition-colors duration-300">
          The ultimate platform to collaborate, create, and showcase your hackathon projects.
          Streamline your workflow with real-time database support and seamless auth.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 dark:shadow-blue-900/30 hover:-translate-y-1">
            Get Started
          </button>
          <button className="px-10 py-4 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:-translate-y-1">
            View Projects
          </button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse transition-colors duration-300"></div>
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-indigo-100 dark:bg-indigo-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700 transition-colors duration-300"></div>
    </div>
  );
};

export default Home;
