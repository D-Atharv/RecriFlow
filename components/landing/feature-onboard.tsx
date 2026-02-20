import Link from "next/link";

export function FeatureOnboard() {
    return (
        <section className="py-24 bg-background-light ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    <div className="lg:w-1/2 w-full">
                        <div className="bg-surface-light  rounded-3xl p-8 aspect-square flex items-center justify-center relative shadow-inner overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200   opacity-50"></div>
                            <div className="relative z-10 w-full max-w-sm">
                                <div className="bg-white  rounded-xl shadow-lg p-4 mb-4 transform -rotate-2 border border-gray-100  animate-float-delayed">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">JD</div>
                                        <div className="h-2 w-24 bg-gray-200  rounded"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-1.5 w-full bg-gray-100  rounded"></div>
                                        <div className="h-1.5 w-3/4 bg-gray-100  rounded"></div>
                                    </div>
                                </div>
                                <div className="bg-white  rounded-xl shadow-xl p-6 relative z-10 border border-gray-100  animate-float">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className="material-icons-outlined text-green-500">check_circle</span>
                                            <span className="font-semibold text-sm">Resume Parsed</span>
                                        </div>
                                        <span className="text-xs text-gray-400">Just now</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">Experience</span>
                                            <span className="font-medium">5 Years</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">Skills</span>
                                            <span className="font-medium">Python, React, AWS</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">Education</span>
                                            <span className="font-medium">M.S. Comp Sci</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-1/2 w-full">
                        <div className="uppercase tracking-widest text-xs font-semibold text-gray-500 mb-4">Onboard</div>
                        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900  mb-6">
                            Automated Resume Parsing
                        </h2>
                        <p className="text-lg text-gray-600  mb-8">
                            High-converting candidate intake, no data entry required. Automatically extract key details from PDFs and Docs.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <span className="material-icons-outlined text-gray-400 mt-0.5">filter_center_focus</span>
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-900 ">Smart Extraction</h4>
                                    <p className="text-sm text-gray-500 mt-1">Identify skills, history, and education instantly.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="material-icons-outlined text-gray-400 mt-0.5">bolt</span>
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-900 ">Optimised for speed</h4>
                                    <p className="text-sm text-gray-500 mt-1">Process thousands of applicants in minutes.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="material-icons-outlined text-gray-400 mt-0.5">translate</span>
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-900 ">Deep localization</h4>
                                    <p className="text-sm text-gray-500 mt-1">Support for resumes in over 30 languages.</p>
                                </div>
                            </li>
                        </ul>
                        <div className="mt-8">
                            <Link className="inline-flex items-center text-sm font-semibold text-primary  hover:underline" href="#">
                                Explore Parsing <span className="material-icons-outlined text-sm ml-1">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
