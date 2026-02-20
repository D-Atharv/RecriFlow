import Image from "next/image";

export function LogoCloud() {
  const logos = [
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBw0VC3zmYY12sgfkm0DHKzvSH4r8l2rO0aiseSbh7WxvNfriNgjt5SSoiyOP4JsopdQUl9B578F_rw0muvOs40KjlGn2gymmOq2AC0Ky-vx0XPit4v3qPCSpHQaIkPlHvTsWj_-wIjT7O_sgYOKvX4yvo5i8pbpmKkSwlMyHNPTl5-fXrsFjKv3FMWc9HR9D8zbItlspHUzJYiSslVuS7iLx0D6zGVOUqSm1-vRF6V8GNyK8S4DKA3yVtGtiCPC80zJcjwK7URbG8",
      alt: "Google",
      className: "h-6 w-auto",
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBISD9ErcDVWSqLjAl7qLSL0s1C1nEiCQvLH_EVUoaqs-uv9OgpaGtqD7EtS4X38Bmraf3m47rXmulL-_2hC7FLhC_k_pxeM13OhT8z2xpTzPJ0pDSlG_m4DoQWbqwZgHZC6zUqzEHxJqXVh_ML6wUqqLkM7iK1OA_yV3j5-IQrAw1t49eua2iflkI1ppFaG-T0RDoxCWw_jPdONx_-oILqOf6wx6x4l-vCPUBYokEBQIMttQFJOjTIuu90HeXvnTR9H3UxYcJwGs0",
      alt: "IBM",
      className: "h-6 w-auto",
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmLg6JmrRPhC_SajtRgJNe-2G_rwFyDeF92e67rv-VmfZcLVlAiUurxjJaG3M7SupN6Zp3MGO8ijtNLho4cU_nAKz3FFeIo1_PfDO9p40QxtGDxilBk5W64tQGF0sYUBffYCKLR_BlZKr3g1Z6nQnwJavUTgI57B2ZuxkZVtxWpzM-7Sf1iYW3CSoFU0l7wQuu8XGv0YQy5Kc7b8-hq1Zg3VZSecycz1aGBRwFVZ0VtyEAPvN47EI5FDAPyDlm80WiCMEruOVOzYY",
      alt: "Amazon",
      className: "h-6 w-auto",
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUqeOZRXNa4uelV6x8PH2yH3RUBhRAAnC5bpPHDKkawcESBtclJo4EOWWxcUG6m71sC55LxQ06F_bfpjRrSCHzQaqAxDRZTBy5Vpnxf7akNe5VghTZLWJ3du9GVWGo3_Cg7JSapdT9g3TkfEHzZHAyzgTgWDkNXdHdyotORzoT6WSzV_wSdo922oXppK8_oijY-z1ZwPQ8Fd01JCD77qy-WOhOU4I9VLlqXrlLCKOSxviQsggTrkrWZ1w850xd6BgaVcprDYTXn-4",
      alt: "Netflix",
      className: "h-5 w-auto",
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMB0JaGYA62B5Gv32sANnK4FKiZhOoUNN9E1PtYBdrBjyiSfZQqrlsVHZTRFWVjx2O3W1mMjcPyj9qYievNa_tjIHLs4UfOf2F2Ej6eHnKCX-zk4DQmZuwE6YpyhgTyo1VyAdnhAqCRq79pWwhiRD3xXPr7PvF4sXMHVd5NR9rdY8FPEElE_9R8pwXtu5f3PFB1nORlPzWH1IqBEzNT00GZm1dlbsO9Mgy3OAsiXlogTyquedn8GTDWofrUpa495pPUg8Do4bKbXw",
      alt: "Airbnb",
      className: "h-7 w-auto",
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDY_5LwRxqUKN0QZkiiqbg9EbCoZ9Zv-ophPArdais_zsroSXzoDJklLqGQ9f1SlDITTMz5HuJgEL2kvWaA3aQ-59O3uhunkazkApP-LrCvys6VVtMgeDgAHzpfzLndzoN57dOBTYA26MDF9821g0THunltdK3UkoiBnmbRwCLOry07tSgpPXOHXQa3lxe6Hjp6S8sfZSe08qERxRmBsd1P3gPIzK46CARcdaSH5f6EsliDx8sLH6As3yJWTr-0Ms6fwYsU2HMFS4",
      alt: "Hubspot",
      className: "h-6 w-auto",
    },
  ];

  return (
    <section className="py-12 border-b border-gray-100 relative z-10 bg-background-light overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-gray-500 mb-8 font-medium">
          Built for modern recruitment teams where talent matters
        </p>
      </div>
      {/* Infinite Scroll Container */}
      <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
        <div className="flex items-center justify-center md:justify-start [&_img]:max-w-none animate-scroll w-max space-x-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {[...logos, ...logos, ...logos].map((logo, i) => (
            <div key={i} className="flex justify-center relative w-32 h-8">
              <Image
                alt={logo.alt}
                className={`object-contain ${logo.className}`}
                src={logo.src}
                fill
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
