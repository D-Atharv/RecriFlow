import Link from "next/link";

export function FeatureData() {
    return (
        <section className="py-24 bg-background-light  border-b border-gray-100 ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    <div className="lg:w-1/2 w-full">
                        <div className="bg-surface-light  rounded-3xl p-8 aspect-square flex items-center justify-center relative shadow-inner overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 to-gray-200   opacity-50"></div>
                            <div className="relative w-full max-w-sm bg-white  rounded-lg shadow-xl overflow-hidden border border-gray-200  animate-float-delayed">
                                <div className="bg-green-50  px-4 py-2 flex items-center gap-2 border-b border-gray-200 ">
                                    <span className="material-icons-outlined text-green-600  text-lg">table_view</span>
                                    <span className="text-xs font-bold text-gray-700 ">Candidates_Q3_Export</span>
                                </div>
                                <div className="divide-y divide-gray-100  text-[10px] md:text-xs">
                                    <div className="grid grid-cols-4 bg-gray-50  font-semibold p-2">
                                        <div className="col-span-1">Name</div>
                                        <div className="col-span-1">Role</div>
                                        <div className="col-span-1">Status</div>
                                        <div className="col-span-1">Score</div>
                                    </div>
                                    <div className="grid grid-cols-4 p-2 items-center hover:bg-gray-50 :bg-gray-700 transition">
                                        <div className="col-span-1 truncate">Jane Doe</div>
                                        <div className="col-span-1 text-gray-500">UX Des</div>
                                        <div className="col-span-1"><span className="bg-blue-100 text-blue-700   px-1.5 py-0.5 rounded text-[10px]">Active</span></div>
                                        <div className="col-span-1 font-mono">92%</div>
                                    </div>
                                    <div className="grid grid-cols-4 p-2 items-center hover:bg-gray-50 :bg-gray-700 transition bg-green-50/50 ">
                                        <div className="col-span-1 truncate font-medium">John Smith</div>
                                        <div className="col-span-1 text-gray-500">DevOps</div>
                                        <div className="col-span-1"><span className="bg-green-100 text-green-700   px-1.5 py-0.5 rounded text-[10px]">Hired</span></div>
                                        <div className="col-span-1 font-mono font-bold">98%</div>
                                    </div>
                                    <div className="grid grid-cols-4 p-2 items-center hover:bg-gray-50 :bg-gray-700 transition">
                                        <div className="col-span-1 truncate">Alice Kay</div>
                                        <div className="col-span-1 text-gray-500">Prod Mgr</div>
                                        <div className="col-span-1"><span className="bg-gray-100 text-gray-700   px-1.5 py-0.5 rounded text-[10px]">Screen</span></div>
                                        <div className="col-span-1 font-mono">85%</div>
                                    </div>
                                </div>
                                <div className="absolute bottom-4 right-4 bg-white  shadow-lg rounded-full px-3 py-1 flex items-center gap-2 border border-gray-100  animate-pulse-soft">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    <span className="text-[10px] font-bold text-gray-600 ">Live Sync</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-1/2 w-full animate-fade-in-up md:animate-delay-200">
                        <div className="uppercase tracking-widest text-xs font-semibold text-gray-500 mb-4">Data Platform</div>
                        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900  mb-6">
                            Unlock data orchestration with Intelligence
                        </h2>
                        <p className="text-lg text-gray-600  mb-8">
                            Power hiring decisions, cut integration costs, and improve conversion by syncing directly to your existing tools.
                        </p>
                        <div className="bg-surface-light  rounded-xl p-6 mb-6">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="material-icons-outlined text-gray-900 ">hub</span>
                                <span className="font-semibold text-gray-900 ">Extensive partner network</span>
                            </div>
                            <p className="text-sm text-gray-500">Leverage one integration to leading HRIS technologies, spreadsheets, and global candidate data providers.</p>
                        </div>
                        <ul className="space-y-3 pl-2">
                            <li className="flex items-center gap-3 text-sm font-medium text-gray-700 ">
                                <span className="material-icons-outlined text-gray-400 text-base">alt_route</span>
                                Smart routing
                            </li>
                            <li className="flex items-center gap-3 text-sm font-medium text-gray-700 ">
                                <span className="material-icons-outlined text-gray-400 text-base">cloud_sync</span>
                                Real-time Google Sheets Sync
                            </li>
                            <li className="flex items-center gap-3 text-sm font-medium text-gray-700 ">
                                <span className="material-icons-outlined text-gray-400 text-base">security</span>
                                Built-in redundancy
                            </li>
                        </ul>
                        <div className="mt-8">
                            <Link className="inline-flex items-center text-sm font-semibold text-primary  hover:underline" href="#">
                                Explore Data <span className="material-icons-outlined text-sm ml-1">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
