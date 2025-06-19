import { Github, Linkedin } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex h-40 w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
      <p className="text-xs text-gray-500">
        © {new Date().getFullYear()} Zipway. All rights reserved.
      </p>
      <nav className="flex flex-col gap-4 sm:ml-auto sm:gap-6">
        <div className="flex items-center justify-center gap-6">
          <Link target="_blank" href={"https://github.com/esdrassantos06"}>
            <Github className="transition-colors hover:text-zinc-500" />
          </Link>
          <Link target="_blank" href={"https://linkedin.com/in/esdrassantos06"}>
            <Linkedin className="transition-colors hover:text-zinc-500" />
          </Link>
        </div>
        <div className="flex gap-4">
          <Link href="#" className="text-xs underline-offset-4 hover:underline">
            Terms of Use{" "}
          </Link>
          <Link href="#" className="text-xs underline-offset-4 hover:underline">
            Privacy
          </Link>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
