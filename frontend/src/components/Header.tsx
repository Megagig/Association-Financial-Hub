const Header = () => {
  return (
    <header className="bg-purple-600 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="text-white text-xl font-bold">
              Association Hub
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/sign-in" className="text-white hover:text-gray-200">
              Sign In
            </a>
            <a
              href="/register"
              className="bg-white text-purple-600 px-4 py-2 rounded-md hover:bg-gray-100"
            >
              Register
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
