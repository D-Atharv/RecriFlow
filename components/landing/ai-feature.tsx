import Image from "next/image";

export function AiFeature() {
    return (
        <section className="relative py-32 overflow-hidden flex items-center justify-center bg-sky-100 ">
            <div className="absolute inset-0 z-0 opacity-80 ">
                <Image
                    alt="Cloudy sky background"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBM-MGD40zNhUBtqvwB7cHVFvCkXdrmd3AdKedQkiJ1q4NQcT1qXpnBX6nQprquAr6JpLGKZe5mV-ll3lfOEHEJl1c9iCl6WEDHKKp_2RLQZzGbyB88DadFYHV9qGLp3PQpk1OmDUKBGSypckGtsd4R6opYvzcoPjRCG3pee1MaY7ZSRG6CmppWIMfqCrjg-JooGwUaKWkU9bKOlmYj3UV4dO31N7s7U2_5GMAZ5vAuDTVZU5vCgPuNf-jhVQy7p8fBMssZ9GFfelw"
                    fill
                    sizes="100vw"
                />
            </div>
            <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
                <div className="inline-block px-3 py-1 rounded-full bg-white/30  backdrop-blur-md border border-white/40  mb-6">
                    <span className="text-xs font-semibold text-gray-800  flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-accent-green"></span> Artificial Intelligence
                    </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900  mb-6">AI built for recruitment.</h2>
                <p className="text-lg text-gray-700  mb-8 leading-relaxed max-w-2xl mx-auto">
                    RecriFlow&apos;s AI agents multiply your output, not your headcount. Accelerate document verification, periodic reviews, automated acceptance, and more.
                </p>
                <button className="bg-white text-gray-900 hover:bg-gray-50 px-6 py-3 rounded-full text-sm font-semibold transition shadow-lg flex items-center gap-2 mx-auto">
                    Discover RecriFlow AI <span className="material-icons-outlined text-sm">arrow_forward</span>
                </button>
            </div>
        </section>
    );
}
