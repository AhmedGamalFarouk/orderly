import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../Firebase/api_util";
import { clearAdmin } from "../features/slices/adminReducer";
import { clearFinalizedOrder } from "../features/slices/orderSlice";
import { auth } from "../Firebase/config";
import { OrderlyBrandIcon } from "../assets/icons/icons";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const adminId = useSelector((state) => state.admin.id);
  const isLoggedIn = Boolean(adminId && adminId !== 0 && auth.currentUser?.uid === adminId);

  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } finally {
      sessionStorage.clear();
      dispatch(clearAdmin());
      dispatch(clearFinalizedOrder());
      setMobileMenuOpen(false);
      navigate("/", { replace: true });
    }
  };

  const navLinks = [
    { label: "Home", to: isLoggedIn ? "/home" : "/" },
    { label: "About", to: "/about-us" },
    { label: "Contact", to: "/contact-us" },
  ];

  return (
    <header className="sticky top-0 z-30 bg-base-100/90 backdrop-blur-md border-b border-base-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <Link
            to={isLoggedIn ? "/home" : "/"}
            className="flex items-center gap-2.5 text-primary hover:opacity-90 transition-opacity"
          >
            <OrderlyBrandIcon className="w-8 h-8 text-primary" />
            <div className="flex flex-col">
              <span className="font-heading text-2xl font-bold tracking-tight text-base-content leading-none">
                ORDERLY
              </span>
              <span className="text-[10px] font-body tracking-wider uppercase text-neutral/70 font-semibold mt-0.5">
                Group Orders
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-base-content hover:text-primary hover:bg-base-200/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {isLoggedIn ? (
              <div className="flex items-center gap-3 pl-3 border-l border-base-200 ml-2">
                <Link
                  to="/create-space"
                  className="btn btn-primary btn-sm px-4 rounded-lg font-medium shadow-xs"
                >
                  + New Space
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-ghost btn-sm text-error hover:bg-error/10 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-3 border-l border-base-200 ml-2">
                <Link
                  to="/signin"
                  className="btn btn-ghost btn-sm text-base-content hover:text-primary rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-primary btn-sm px-4 rounded-lg"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              aria-label="Toggle navigation menu"
              className="btn btn-ghost btn-square btn-sm text-base-content"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-base-100 border-b border-base-200 px-4 pt-2 pb-4 space-y-2 animate-fade-in-up">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-base-content hover:bg-base-200"
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <div className="pt-2 border-t border-base-200 flex flex-col gap-2">
              <Link
                to="/create-space"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary btn-sm w-full"
              >
                + Create New Space
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-outline btn-error btn-sm w-full"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-base-200 flex flex-col gap-2">
              <Link
                to="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-ghost btn-sm w-full"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary btn-sm w-full"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
