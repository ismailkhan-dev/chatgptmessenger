import React from "react";
import {
    BoltIcon,
    ExclamationTriangleIcon,
    SunIcon,
} from "@heroicons/react/24/outline";

function HomePage() {
    return (
        <div className="text-white px-2 flex flex-col items-center justify-center h-screen md:px-9">
            <div className="text-center">
                <div className="flex space-x-4 mb-3 items-center">
                    <img
                        src="/tophat.svg"
                        alt="Chap top hat"
                        className="h-16 w-16"
                    />
                    <h1 className="text-5xl font-bold">ChapGPT</h1>
                </div>
                <p className="mb-20 flex items-center justify-center gap-1">
                    Developed by:
                    <a
                        href="https://ismailkhan-dev.github.io/"
                        target="_blank"
                        className="text-white font-bold underline hover:text-blue-400"
                    >
                        Ismail Khan
                    </a>
                </p>
            </div>

            <div className="flex flex-col md:flex-row md:items-start md:space-x-5 items-center text-center">
                <div className="mb-9 md:mb-0">
                    <div className="flex flex-row md:flex-col items-center justify-center mb-5 space-x-2 md:space-x-0 md:space-y-2">
                        {/* Sun Icon */}
                        <SunIcon className="h-8 w-8" />

                        <h2>Examples</h2>
                    </div>

                    <div className="space-y-2">
                        <p className="infoText">Explain Something to me</p>
                        <p className="infoText">
                            What is the diference between a dog and a cat
                        </p>
                        <p className="infoText">What is the color of the sun</p>
                    </div>
                </div>
                <div className="mb-9 md:mb-0">
                    <div className="flex flex-row md:flex-col items-center justify-center mb-5 space-x-2 md:space-x-0 md:space-y-2">
                        {/* Sun Icon */}
                        <BoltIcon className="h-8 w-8" />

                        <h2>Capabilities</h2>
                    </div>

                    <div className="space-y-2">
                        <p className="infoText">
                            Change the ChatGPT Model to use
                        </p>
                        <p className="infoText">
                            Messages are stored in Firebase's Firestore
                        </p>
                        <p className="infoText">
                            Hot Toast notifications when ChatGPT is thinking!
                        </p>
                    </div>
                </div>
                <div className="mb-9 md:mb-0">
                    <div className="flex flex-row md:flex-col items-center justify-center mb-5 space-x-2 md:space-x-0 md:space-y-2">
                        {/* Sun Icon */}
                        <ExclamationTriangleIcon className="h-8 w-8" />

                        <h2>Limitations</h2>
                    </div>

                    <div className="space-y-2">
                        <p className="infoText">
                            May occassionally generate incorrect information
                        </p>
                        <p className="infoText">
                            May occassionally produce harmful instructions or
                            biased content
                        </p>
                        <p className="infoText">
                            Limited knowledge of world and events after Jan 2022
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
