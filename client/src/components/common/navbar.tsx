const Navbar = () => {
    return (
        <nav className="bg-white shadow-xl border-b border-orange-200 rounded mx-28 my-3">
            <div className="max-w-7xl mx-auto px-4 sm:px-12 lg:px-24">
                <div className="flex justify-between items-center h-16">
                    
                    {/* Title/Logo on the left */}
                    <div className="flex items-center space-x-3">
                        <span className="text-2xl">🍽️</span>
                        <h1 className="text-xl font-bold text-gray-900">
                            Tasty Bites
                        </h1>
                    </div>

                    {/* Sign Up and Login on the right */}
                    <div className="flex items-center space-x-4">
                        <button className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
                            Login
                        </button>
                        <button className="bg-orange-500 hover:bg-white hover:border-2 hover:border-orange-500 hover:text-orange-500 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;