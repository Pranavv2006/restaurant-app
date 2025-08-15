interface RegisterProps {
  onClose: () => void;
}

const Register = ({ onClose }: RegisterProps) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white border border-gray-200 rounded-xl shadow-2xl max-w-lg w-full m-3 dark:bg-neutral-900 dark:border-neutral-800">
                <div className="p-4 sm:p-7">
                    <div className="text-center">
                        <h3 className="block text-2xl font-bold text-gray-800 dark:text-neutral-200">Sign up</h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                            Already have an account?
                            <a className="text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500 ml-1" href="#">
                                Sign in here
                            </a>
                        </p>
                    </div>

                    <div className="mt-5">
                        <form>
                            <div className="grid gap-y-4">
                                <div>
                                    <label className="block text-sm mb-2 dark:text-white">Email address</label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                                        required 
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm mb-2 dark:text-white">Password</label>
                                    <input 
                                        type="password" 
                                        id="password" 
                                        name="password" 
                                        className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" 
                                        required 
                                        placeholder="Enter your password"
                                    />
                                </div>

                                <button type="submit" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                                    Sign up
                                </button>
                            </div>
                        </form>
                        
                        {/* Close button */}
                        <button 
                            onClick={onClose}
                            className="mt-4 w-full py-2 px-4 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;