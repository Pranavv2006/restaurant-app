interface AlreadyExistsProps {
    onClose: () => void;
    onSwitchToLogin: () => void;
}


const AlreadyExists = ({ onClose, onSwitchToLogin }: AlreadyExistsProps) => {

    const handleSwitchToLogin = () => {
        onClose();
        onSwitchToLogin();
    };

    return (
        <div id="hs-task-created-alert" className="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto" role="dialog" aria-labelledby="hs-task-created-alert-label">
            <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
                <div className="relative flex flex-col bg-white shadow-lg rounded-xl dark:bg-neutral-900">
                <div className="absolute top-2 end-2">
                    <button type="button" className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-400 dark:focus:bg-neutral-600" aria-label="Close" data-hs-overlay="#hs-task-created-alert">
                    <span className="sr-only">Close</span>
                    <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                </div>

                <div className="p-4 sm:p-10 text-center overflow-y-auto">
                    <span className="mb-4 inline-flex justify-center items-center size-11 rounded-full border-4 border-green-50 bg-green-100 text-green-500 dark:bg-green-700 dark:border-green-600 dark:text-green-100">
                    <svg className="shrink-0 size-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
                    </svg>
                    </span>

                    <h3 id="hs-task-created-alert-label" className="mb-2 text-xl font-bold text-gray-800 dark:text-neutral-200">
                    User Exists!
                    </h3>
                    <p className="text-gray-500 dark:text-neutral-500">
                    The Email you entered is already associated with an account. Please <a className="inline-flex items-center gap-x-1.5 text-violet-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-violet-500" href="#" onClick={handleSwitchToLogin}>log in</a> or use a different email address.
                    </p>

                    <div className="mt-6 flex justify-center gap-x-4">
                    <button type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-50 dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" data-hs-overlay="#hs-task-created-alert">
                        Close
                    </button>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default AlreadyExists;