import Image from "next/image";
import Link from "next/link";

export function NewsSection() {
    const news = [
        {
            title: "RecriFlow raises $150m Series B led by CapitalG",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCitDCsCI09Nj55X197bQ_Sptz2sgrN36jksG9HnQ_M2jnpm1lQ6eHnNbaIxUyPAcO6Rw1LYrWtKmMonURlhcbdiWRvEm2m-O5l6Om8qUQpQS3DG7cVAd8s7nUlQNW_XfrKb4oNBAUfO0CuUYtiuOnPyz12xK0_ywx5VMcKISyfJehEBwMEh_8LUXiRPmVC5XbHPuJtMvztdnOO_cxmcKmDbTUZGVVHh-q0jlxY0BCreNPRPcZ7EN-J5PBNMINvbAxnWa2ZJJb_hZE",
            label: "CapitalG"
        },
        {
            title: "Introducing RecriFlow 2.0: The AI Recruiter",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBrJ6iC9IAkDtzk4BXVcdpW1aVBlouqtNgsJHIjI_aGJiVZT5NnlpBcJRIyef3YI9PZH-fixN4AGcK5XQggllWthW7HTWiD-zgjmfulR21nd95xMwWSynSpuooJCr1cdIqGG2SumRH_I05PW4j7AGkgo3HOxFMLjqMJ1sQrBe-u3C_GtSUn9GXrsnR1x7vYLh0iz2W2XvGGzlTvBKbrUWgkDrWENDRO9B9DcLCt6az_KAXOg0MLl13RdfpXEK3H13NRzv_u0TfV4dQ",
            playButton: true
        },
        {
            title: "Customer Story: How Acme Corp hired 50 engineers in 30 days",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrx8hQnSqqedlmuq702dwlvT2Gr4H5gnKsv8wwgCoEnYfxEuA4wiSufBoVPnE0gAefTkyiqkqd1ggH13B3diwWZmBuXIIUYOVw2oLCxVa5r_qVrw0ka_ibXEcljiXMCHZ96cf4fORqSQiFyuvtbPP0XSoJYS_YOA9yyDKRp_nQ6lCo5uz_JwPqec4-GYotZsZMprK7hYBEjncfJU1jlFJSmz5b49HNmxcC3s_V2ixhHqN1DTMqmdoyDQechHVlJOE0WFSDsWlsBJQ"
        }
    ];

    return (
        <section className="py-24 bg-background-light ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <h2 className="text-3xl font-semibold text-gray-900 ">News</h2>
                    <Link className="text-sm font-medium text-gray-500 hover:text-gray-900 :text-white transition" href="#">See more</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {news.map((item, index) => (
                        <Link key={index} className="group block" href="#">
                            <div className="rounded-xl overflow-hidden aspect-[4/3] mb-4 relative">
                                <Image
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    src={item.image}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />

                                {item.label && (
                                    <>
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition"></div>
                                        <div className="absolute bottom-6 left-6 text-white text-2xl font-bold">{item.label}</div>
                                    </>
                                )}

                                {item.playButton && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 border border-white/50 rounded-full flex items-center justify-center">
                                            <div className="w-10 h-10 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900  group-hover:underline">{item.title}</h3>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
