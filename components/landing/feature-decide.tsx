import Link from "next/link";

export function FeatureDecide() {
    return (
        <section className="py-24 bg-background-light ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">
                    <div className="lg:w-1/2 w-full">
                        <div className="bg-surface-light  rounded-3xl p-8 aspect-square flex items-center justify-center relative shadow-inner overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-bl from-gray-100 to-gray-200   opacity-50"></div>
                            <div className="relative w-full max-w-sm bg-white  rounded-xl shadow-xl overflow-hidden border border-gray-100  animate-float">
                                <div className="bg-gray-50  px-4 py-3 border-b border-gray-100  flex justify-between items-center">
                                    <span className="text-xs font-semibold uppercase text-gray-500">Interview Scorecard</span>
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                    </div>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-700 ">Technical Skill</span>
                                            <span className="font-bold text-green-600">4.5/5</span>
                                        </div>
                                        <div className="w-full bg-gray-100  rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: "90%" }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-700 ">Culture Fit</span>
                                            <span className="font-bold text-yellow-600">3.8/5</span>
                                        </div>
                                        <div className="w-full bg-gray-100  rounded-full h-2">
                                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "76%" }}></div>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <div className="text-xs text-gray-500 mb-1">Interviewer Note</div>
                                        <div className="p-2 bg-gray-50  rounded text-xs text-gray-600  italic">
                                            &quot;Candidate showed strong problem solving skills...&quot;
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-1/2 w-full animate-fade-in-up md:animate-delay-200">
                        <div className="uppercase tracking-widest text-xs font-semibold text-gray-500 mb-4">Decide</div>
                        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900  mb-6">
                            Structured Feedback &amp; Scorecards
                        </h2>
                        <p className="text-lg text-gray-600  mb-8">
                            Increase hiring quality and cut bias — by standardizing interview feedback.
                        </p>
                        <div className="bg-surface-light  rounded-xl p-6 mb-6">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="material-icons-outlined text-gray-900 ">assignment_turned_in</span>
                                <span className="font-semibold text-gray-900 ">Automated tasks</span>
                            </div>
                            <p className="text-sm text-gray-500">Translate hiring policies into distinct tasks, automate with AI technologies, and auto-approve clear fits.</p>
                        </div>
                        <ul className="space-y-3 pl-2">
                            <li className="flex items-center gap-3 text-sm font-medium text-gray-700 ">
                                <span className="material-icons-outlined text-gray-400 text-base">visibility</span>
                                Increased interviewer alignment
                            </li>
                            <li className="flex items-center gap-3 text-sm font-medium text-gray-700 ">
                                <span className="material-icons-outlined text-gray-400 text-base">chat</span>
                                In-platform messaging
                            </li>
                            <li className="flex items-center gap-3 text-sm font-medium text-gray-700 ">
                                <span className="material-icons-outlined text-gray-400 text-base">history_edu</span>
                                Auditability for compliance
                            </li>
                        </ul>
                        <div className="mt-8">
                            <Link className="inline-flex items-center text-sm font-semibold text-primary  hover:underline" href="#">
                                Explore Decisions <span className="material-icons-outlined text-sm ml-1">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
