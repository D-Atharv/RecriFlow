import Image from "next/image";

export function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden animate-fade-in-up">
            <div className="absolute inset-0 z-0 h-[120%] w-full hero-mask">
                <Image
                    alt="Painted landscape background"
                    className="w-full h-full object-cover opacity-90  animate-pulse-soft"
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop"
                    fill
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-background-light  "></div>
            </div>
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5  backdrop-blur-sm border border-black/5  mb-8 animate-fade-in-up">
                    <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">New</span>
                    <span className="text-xs font-medium text-gray-800 ">RecriFlow Series A Funding</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-gray-900  mb-6 leading-[1.1] animate-fade-in-up md:animate-delay-100">
                    The new standard <br className="hidden md:block" /> in hiring
                </h1>
                <p className="text-xl md:text-2xl text-gray-600  mb-10 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up md:animate-delay-200">
                    Meet the AI-native platform that accelerates candidate screening, automates resume parsing, and grows your talent pool.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up md:animate-delay-300">
                    <button className="bg-primary hover:bg-gray-800 text-white px-8 py-4 rounded-full text-base font-medium transition shadow-lg   :bg-gray-200">
                        Get started
                    </button>
                </div>
            </div>
        </section>
    );
}
