import { Link } from "react-router";
import { useState } from "react";
import Input from "./Input";

const footerLinks = [
  {
    title: "help",
    sublinks: [
      { title: "chat with us!", href: "" },
      { title: "returns & exchanges", href: "" },
      { title: "FAQ/Contact Us", href: "" },
    ],
  },
  {
    title: "shop",
    sublinks: [
      { title: "men's shop", href: "" },
      { title: "women's shop", href: "" },
      { title: "men's apparel", href: "" },
      { title: "women's apparel", href: "" },
      { title: "socks", href: "" },
      { title: "gift cards", href: "" },
    ],
  },
  {
    title: "company",
    sublinks: [
      { title: "our stores!", href: "" },
      { title: "our story", href: "" },
      { title: "our materials", href: "" },
      { title: "sustainability", href: "" },
      { title: "investors", href: "" },
      { title: "careers", href: "" },
      { title: "our blog", href: "" },
    ],
  },
];

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSignUp = () => {
    console.log(email);
  };

  return (
    <footer className="wrapper bg-dark pt-16 pb-8 text-light divide-y-[1px] divide-[#eeeeee10]">
      <div className="flex items-start gap-[15%] pb-8">
        {footerLinks.map((link, index) => {
          return (
            <div key={index}>
              <h4 className="text-lg font-medium uppercase tracking-widest">
                {link.title}
              </h4>
              <ul className="mt-4 space-y-2">
                {link.sublinks.map((sublink, index) => {
                  return (
                    <li
                      key={index}
                      className="text-base font-extralight hover:opacity-50">
                      <Link to={sublink.href} className="capitalize">
                        {sublink.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="py-8">
        <div className="mx-auto w-[95%] lg:w-1/2 space-y-4 text-center">
          <h2 className="text-2xl font-extrabold uppercase tracking-wider">
            Be The First To Know!
          </h2>
          <p className="font-extralight text-lg">
            Join our email list and be the first to know about new limited
            edition products, material innovations, and lots of other fun
            updates.
          </p>
          <div className="flex-center gap-2">
            <Input
              showLabel={false}
              label="Enter Your Email Address"
              type="email"
              value={email}
              extraStyle="rounded-none mt-1 block w-full border border-gray-300 px-3 py-2 shadow-sm focus:border-[#39523f] focus:outline-none focus:ring-1 focus:ring-[#39523f]"
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleSignUp}
              className="bg-primary text-light px-4 py-2 uppercase font-semibold cursor-pointer hover:bg-gray-400">
              sign up
            </button>
          </div>
        </div>
      </div>

      <div className="pt-8">
        <p className="text-center text-sm">
          &copy; {new Date().getFullYear()} ShoeZone. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
