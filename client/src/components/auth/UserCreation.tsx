interface UserCreationProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

const UserCreation = ({ isOpen, onClose, userName }: UserCreationProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-80">
            <div className="bg-white shadow-lg rounded-xl max-w-lg w-full m-3 dark:bg-neutral-900">
                <div className="relative">
                    {/* Close Button */}
                    <div className="absolute top-2 end-2">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600" 
                            aria-label="Close"
                        >
                            <span className="sr-only">Close</span>
                            <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6 6 18"/>
                                <path d="m6 6 12 12"/>
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-10 text-center overflow-y-auto">
                        <span className="mb-4 inline-flex justify-center items-center size-11 rounded-full border-4 border-green-50 bg-green-100 text-green-500 dark:bg-green-700 dark:border-green-600 dark:text-green-100">
                            <svg className="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                            </svg>
                        </span>

                        <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-neutral-200">
                            Successfully Registered!
                        </h3>
                        <p className="text-gray-500 dark:text-neutral-500">
                            {userName ? `Welcome ${userName}! ` : 'Welcome! '}
                            You can now log into your{' '}
                            <span className="inline-flex items-center gap-x-1.5 text-violet-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-violet-500">
                                personal account.
                            </span>
                        </p>

                        <div className="mt-6 flex justify-center gap-x-4">
                            <button 
                                type="button" 
                                onClick={onClose}
                                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );  
};

export default UserCreation;