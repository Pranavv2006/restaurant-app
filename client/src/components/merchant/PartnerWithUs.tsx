import React from "react";
import { useNavigate } from "react-router-dom";


const PartnerWithUs: React.FC = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
      navigate("/onboarding");
      window.scrollTo(0, 0);
    };

    return (
        <section>
            <div className="bg-linear-to-b from-violet-600/10 via-transparent">
                <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-8">
                    <div className="max-w-3xl text-center mx-auto">
                        <h1 className="block font-medium text-gray-200 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                            Get your Restaurant Delievery Ready in a <span className="text-violet-700">Few Minutes!</span>
                        </h1>
                    </div>

                    <div className="max-w-3xl text-center mx-auto">
                        <p className="text-lg text-white/70">Increase your online orders and Reach customers far away from you with Access to DineDash tools and support</p>
                    </div>

                    <div className="text-center">
                        <button type="button" className="text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-violet-600 dark:hover:bg-violet-700 dark:focus:ring-violet-800" onClick={handleButtonClick}>
                            Partner With US
                            <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PartnerWithUs;