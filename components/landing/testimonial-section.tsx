import Image from "next/image";

export function TestimonialSection() {
    return (
        <section className="py-20 bg-background-light ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h3 className="text-2xl font-semibold text-gray-900 ">Trusted by leaders</h3>
                    <p className="text-sm text-gray-500 mt-2">Run your hiring process like the world&apos;s best companies.</p>
                </div>
                <div className="bg-surface-light  rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row">
                    <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                        <blockquote className="text-2xl md:text-3xl font-medium text-gray-900  leading-snug mb-8">
                            &quot;What sets RecriFlow apart is the sheer speed of resume parsing. We can automate initial screening and still explain every decision to hiring managers.&quot;
                        </blockquote>
                        <div>
                            <div className="font-bold text-gray-900 ">Sarah Jenkins</div>
                            <div className="text-sm text-gray-500 ">Head of Talent, TechGrow</div>
                        </div>
                    </div>
                    <div className="md:w-1/2 relative h-64 md:h-auto">
                        <Image
                            alt="Sarah Jenkins portrait"
                            className="absolute inset-0 w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDv6I39EIJsBvOpHSdQIRmhynaH7Vw9-uGfgKIHW8iMNWV9LsxIEmLhvzX1TVBF4lu1ELgJCc27_3hAMwy6OVXdnTJ1l8DoWoBedmcvPTl6B7-7UXBUdoI6Da8KkEYTxQjalIxXwqkDztOBXEiWQYtCbB9PtG9xofFiAkt2fKjfM53w0keu55M-0WRye7O-4phamfkLClUBW9HP52ZxzgfHR4cjPTyiF_itgMIRRTipcJvKnLEmCrnBcmr4VLL54d0vTMGewEY9zhc"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
