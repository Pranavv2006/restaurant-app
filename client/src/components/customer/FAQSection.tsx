import React from "react";
import AccordionUsage from "./AccordionUsage";

const FAQSection: React.FC = () => {
    return (
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
            <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
                <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">Your questions, answered</h2>
                <p className="mt-1 text-gray-600 dark:text-neutral-400">Answers to the most frequently asked questions.</p>
            </div>
            <div>
                <AccordionUsage />
            </div>
        </div>
    );
};

export default FAQSection;