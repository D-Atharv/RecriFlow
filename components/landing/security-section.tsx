import Link from "next/link";

export function SecuritySection() {
    return (
        <section className="py-20 bg-surface-light ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="max-w-2xl">
                    <h3 className="text-2xl font-bold text-gray-900  mb-4">Safe and secure</h3>
                    <p className="text-gray-600  text-sm leading-relaxed mb-6">
                        Your trust is our foundation. RecriFlow is designed with a deep commitment to data privacy and security. Visit our trust page and security center to learn more.
                    </p>
                    <Link className="inline-flex items-center text-xs font-bold border border-gray-300  rounded-full px-4 py-2 hover:bg-gray-100 :bg-gray-700 transition" href="#">
                        Explore <span className="material-icons-outlined text-sm ml-1">chevron_right</span>
                    </Link>
                </div>
                <div className="flex gap-6 opacity-80 grayscale">
                    <div className="h-16 w-16 border-2 border-gray-300  rounded-full flex flex-col items-center justify-center text-[8px] font-bold text-center text-gray-500 ">
                        SOC2<br />Type II
                    </div>
                    <div className="h-16 w-16 border-2 border-gray-300  rounded-full flex flex-col items-center justify-center text-[8px] font-bold text-center text-gray-500 ">
                        GDPR<br />Ready
                    </div>
                    <div className="h-16 w-16 border-2 border-gray-300  rounded-full flex flex-col items-center justify-center text-[8px] font-bold text-center text-gray-500 ">
                        ISO<br />27001
                    </div>
                </div>
            </div>
        </section>
    );
}
