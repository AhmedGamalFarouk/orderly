import { Outlet, Link } from "react-router";
import Navbar from "./Navbar";
import { OrderlyBrandIcon } from "../assets/icons/icons";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-base-100 font-body text-base-content antialiased">
      <div>
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>

      <footer className="border-t border-base-200/80 bg-white/70 py-6 px-4 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-primary/10 text-primary">
              <OrderlyBrandIcon className="w-4 h-4" />
            </div>
            <span className="font-heading font-bold text-sm text-base-content">
              Orderly
            </span>
            <span>— Group food ordering made effortless.</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <Link to="/about-us" className="hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/contact-us" className="hover:text-primary transition-colors">
              Contact
            </Link>
            <Link to="/home" className="hover:text-primary transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

