import nikaiLogo from "@/assets/nikai-logo.png";

const footerLinks: Record<string, string[]> = {
  Product: ["Features", "Integrations", "Changelog"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Resources: ["Documentation", "Help Center", "API Reference", "Status"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

const Footer = () => (
  <footer className="bg-[#F4F4FF] border-t border-[rgba(156,111,228,0.08)] py-10 sm:py-16 px-4 sm:px-6 relative z-10">
    <div className="mx-auto max-w-[1200px]">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
        <div className="col-span-2 md:col-span-1">
          <img
            src={nikaiLogo}
            alt="NikAI"
            className="h-10 mb-4"
            style={{ filter: "drop-shadow(0 0 8px rgba(224,64,251,0.5))" }}
          />
          <p className="text-sm text-[#4A4A6A] mb-2">AI that runs your operations.</p>
          <p className="text-sm text-[#4A4A6A]">Made with ❤️ in India</p>
        </div>
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 className="font-['Geist'] font-semibold text-[#0D0D1F] mb-4 text-sm">{title}</h4>
            <ul className="flex flex-col gap-2">
              {links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-[#4A4A6A] hover:text-[#0D0D1F] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-[rgba(156,111,228,0.08)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-[#4A4A6A]">© 2025 NikAI. All rights reserved.</p>
        <div className="flex gap-4">
          {["LinkedIn", "Instagram", "Twitter"].map((s) => (
            <a key={s} href="#" className="text-sm text-[#4A4A6A] hover:text-[#0D0D1F] transition-colors">
              {s}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
