"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faRightFromBracket,
  faCheckCircle,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import LoginModal from "@/app/(pages)/login";
import RegisterModal from "@/app/(pages)/register";
import Toast from "../_Toast/Toast";
import { useRouter } from "next/navigation";

interface HeaderProps {
  isHome?: boolean;
  homeAnimationDone?: boolean;
}

const HomeHeader = ({
  isHome = false,
  homeAnimationDone = false,
}: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [showBg, setShowBg] = useState(!isHome);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState<"login" | "register" | null>(null);
  const [userLogin, setUserLogin] = useState<any>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("USER_LOGIN");

    if (!storedUser) {
      setUserLogin(null);
      return;
    }

    try {
      const parsed = JSON.parse(storedUser);
      if (!parsed?.content?.user) throw new Error();
      setUserLogin(parsed);
    } catch {
      localStorage.removeItem("USER_LOGIN");
      localStorage.removeItem("TOKEN");
      document.cookie = "TOKEN=; path=/; max-age=0; samesite=lax";
      setUserLogin(null);
    }
  }, [pathname]);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setShowBg(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    const handleOpenModal = (event: any) => {
      const mode = event.detail?.mode || "login";
      setAuthModal(mode);
      setDropdownOpen(false);
      setIsMenuOpen(false);
    };

    window.addEventListener("OPEN_AUTH_MODAL", handleOpenModal);
    return () => window.removeEventListener("OPEN_AUTH_MODAL", handleOpenModal);
  }, []);

  const handleLoginSuccess = (userData: any) => {
    localStorage.setItem("USER_LOGIN", JSON.stringify(userData));
    localStorage.setItem("TOKEN", userData?.content?.token || "");
    const role = userData?.content?.user.role;
    if (role === "ADMIN") {
      document.cookie = `TOKEN=${userData?.content?.token}; path=/; samesite=lax`;
    } else {
      document.cookie = `TOKEN=User; path=/; samesite=lax`;
    }
    setUserLogin(userData);
    setAuthModal(null);
    window.dispatchEvent(new Event("LOGIN_SUCCESS"));
    setToastMessage("Logged in successfully!");
    setShowToast(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("USER_LOGIN");
    localStorage.removeItem("TOKEN");
    document.cookie = "TOKEN=; path=/; max-age=0; samesite=lax";
    setUserLogin(null);
    setDropdownOpen(false);
    window.dispatchEvent(new Event("LOGIN_SUCCESS"));
  };

  const handleRegisterSuccess = () => {
    setAuthModal(null);
    setToastMessage("Registered successfully!");
    setShowToast(true);
  };

  const HeaderContent = (
    <div className="flex items-center justify-between py-4 sm:py-4 md:py-4 lg:py-0">
      <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 flex-1">
        <button
          className="lg:hidden p-2 text-gray-700 cursor-pointer hover:bg-black/5 rounded-full transition-colors"
          onClick={() => setIsMenuOpen(true)}
        >
          <FontAwesomeIcon icon={faBars} className="text-xl" />
        </button>

        <Link
          href="/"
          className="lg:hidden cursor-pointer active:scale-95 transition-transform"
        >
          <img
            src="/img/logo.png"
            className="h-8 sm:h-10 object-contain"
            alt="Logo"
          />
        </Link>

        <div className="hidden lg:flex items-center gap-2 xl:gap-6 font-semibold">
          <Link
            href="/inspiration"
            className={`px-4 py-1.5 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 ${pathname === "/inspiration"
              ? "bg-black text-white shadow"
              : "text-gray-700 hover:bg-black/5"
              }`}
          >
            Inspiration
          </Link>
          <Link
            href="/blogs"
            className={`px-4 py-1.5 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 ${pathname === "/blogs"
              ? "bg-black text-white shadow"
              : "text-gray-700 hover:bg-black/5"
              }`}
          >
            Blogs
          </Link>
        </div>
      </div>

      <div className="hidden lg:block">
        <Link href="/" className="cursor-pointer group">
          <div className="bg-[#C3DFE3] px-10 xl:px-14 py-3 xl:py-4 shadow-md [clip-path:polygon(0%_0%,100%_0%,80%_100%,20%_100%)]">
            <img
              src="/img/logo.png"
              className="h-10 xl:h-12 mx-auto pointer-events-none"
              alt="Logo"
            />
          </div>
        </Link>
      </div>

      <div
        className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 justify-end relative"
        ref={dropdownRef}
      >
        <Link
          href="/listing"
          className="px-3 sm:px-4 xl:px-6 py-1.5 sm:py-2 rounded-full cursor-pointer text-white 
        bg-linear-to-br from-blue-900 via-indigo-500 to-pink-500 
        text-[10px] sm:text-xs xl:text-sm font-medium 
        transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 shadow-sm whitespace-nowrap"
        >
          List Now
        </Link>

        <div
          className="flex items-center gap-1.5 sm:gap-2 xl:gap-3 
        bg-white/40 backdrop-blur-md 
        px-2 sm:px-2.5 xl:px-3 
        py-1 sm:py-1.5 
        rounded-full border border-white/30 shadow-inner"
        >
          <AnimatePresence mode="wait">
            {userLogin ? (
              <motion.div
                key="logged-in"
                initial={{ opacity: 0, x: 4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 4 }}
                className="flex items-center"
              >
                <span
                  className="text-[10px] sm:text-xs xl:text-sm font-medium text-gray-700 truncate"
                  title={userLogin?.content?.user?.name || ""}
                >
                  Welcome,&nbsp;
                  <span className="font-bold text-[#143944] truncate">
                    {userLogin?.content?.user?.name || "User"}
                  </span>
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="guest"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 3 }}
                className="flex items-center max-w-22.5 sm:max-w-35 xl:max-w-none"
              >
                <span className="text-[10px] sm:text-xs xl:text-sm font-semibold text-gray-700 truncate">
                  Sign in to get started
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-7 h-7 sm:w-8 sm:h-8 xl:w-9 xl:h-9 
            rounded-full overflow-hidden cursor-pointer 
            bg-[#143944] text-white 
            flex items-center justify-center 
            transition-all hover:scale-105 hover:ring-2 ring-offset-2 ring-[#143944] 
            shadow-md active:scale-95 shrink-0"
          >
            {userLogin ? (
              <img
                src={userLogin.avatar || "/img/avatarLogo.jpg"}
                className="w-full h-full object-cover"
                alt="Avatar"
              />
            ) : (
              <FontAwesomeIcon
                icon={faUser}
                className="text-[10px] sm:text-xs xl:text-sm"
              />
            )}
          </button>
        </div>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`absolute right-0 top-12 sm:top-14 
            ${userLogin ? "w-105 xl:w-120" : "w-44"} 
            bg-white/95 backdrop-blur-md 
            rounded-2xl shadow-2xl border border-gray-100 z-2 p-4`}
            >
              {userLogin ? (
                userLogin.content.user.role === "ADMIN" ? (
                  <div className="flex flex-col gap-2 px-2 py-1 text-sm text-gray-700">
                    <Link
                      href="/admin/dashboard"
                      onClick={() => {
                        setDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left cursor-pointer 
                            text-gray-700 hover:bg-gray-100 rounded-xl transition-all font-medium"
                    >
                      Go to Admin Page
                    </Link>

                    <div className="h-px bg-gray-200 my-2" />

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left cursor-pointer 
                            text-[#a50000] hover:bg-[#74A8A4] rounded-xl 
                            flex items-center gap-3 transition-all font-medium"
                    >
                      <FontAwesomeIcon icon={faRightFromBracket} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 px-2 py-1 text-sm text-gray-700">
                    <div className="flex gap-3">
                      <span className="font-semibold w-28 shrink-0">Name:</span>
                      <span>{userLogin?.content?.user?.name || "User"}</span>
                    </div>

                    <div className="flex gap-3">
                      <span className="font-semibold w-28 shrink-0">
                        Email:
                      </span>
                      <span className="break-all">
                        {userLogin.content.user.email}
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <span className="font-semibold w-28 shrink-0">
                        Birthday:
                      </span>
                      <span>{userLogin.content.user.birthday}</span>
                    </div>

                    <div className="flex gap-3">
                      <span className="font-semibold w-28 shrink-0">
                        Gender:
                      </span>
                      <span>
                        {userLogin.content.user.gender ? "Male" : "Female"}
                      </span>
                    </div>

                    <div className="h-px bg-gray-200 my-3" />

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left cursor-pointer 
                            text-[#a50000] hover:bg-[#74A8A4] rounded-xl 
                            flex items-center gap-3 transition-all duration-300 font-medium"
                    >
                      <FontAwesomeIcon icon={faRightFromBracket} />
                      Logout
                    </button>
                  </div>
                )
              ) : (
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setAuthModal("login");
                      setDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left cursor-pointer 
                        text-gray-700 hover:bg-gray-100 rounded-xl transition-all font-medium text-sm"
                  >
                    Login
                  </button>

                  <button
                    onClick={() => {
                      setAuthModal("register");
                      setDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left cursor-pointer 
                        text-gray-700 hover:bg-gray-100 rounded-xl transition-all font-medium text-sm"
                  >
                    Register
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-2 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-70 sm:w-[320px] 
    bg-white z-2 shadow-2xl p-6 lg:hidden"
            >
              <div className="flex justify-between items-center mb-10">
                <img src="/img/logo.png" className="h-8" alt="Logo" />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl text-gray-400 cursor-pointer p-2 hover:text-black"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <nav className="flex flex-col gap-2">
                <Link
                  href="/inspiration"
                  onClick={() => setIsMenuOpen(false)}
                  className={`p-4 rounded-2xl font-semibold text-lg cursor-pointer transition-colors ${pathname === "/inspiration" ? "bg-[#C3DFE3] text-[#143944]" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  Inspiration
                </Link>

                <Link
                  href="/blogs"
                  onClick={() => setIsMenuOpen(false)}
                  className={`p-4 rounded-2xl font-semibold text-lg cursor-pointer transition-colors ${pathname === "/blogs" ? "bg-[#C3DFE3] text-[#143944]" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  Blogs
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {isHome ? (
        <AnimatePresence>
          {homeAnimationDone && (
            <motion.header
              initial={{ y: -60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
              className={`fixed top-0 left-0 w-full z-2 transition-all duration-300 rounded-b-2xl sm:rounded-b-3xl lg:rounded-b-4xl xl:rounded-b-[2.5rem] ${showBg
                ? "bg-[#C3DFE3] shadow-md"
                : "bg-white/30 backdrop-blur-sm"
                }`}
            >
              <div className="app-container mx-auto">{HeaderContent}</div>
            </motion.header>
          )}
        </AnimatePresence>
      ) : (
        <header className="sticky top-0 z-2 bg-[#C3DFE3] shadow-md rounded-b-lg sm:rounded-b-xl md:rounded-b-2xl lg:rounded-b-3xl xl:rounded-b-4xl">
          <div className="app-container mx-auto">{HeaderContent}</div>
        </header>
      )}

      <AnimatePresence>
        {authModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setAuthModal(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="app-container mx-auto"
            >
              {authModal === "login" && (
                <LoginModal
                  onClose={() => setAuthModal(null)}
                  onSwitchRegister={() => setAuthModal("register")}
                  onLoginSuccess={handleLoginSuccess}
                />
              )}
              {authModal === "register" && (
                <RegisterModal
                  onClose={() => setAuthModal(null)}
                  onSwitchLogin={() => setAuthModal("login")}
                  onRegisterSuccess={handleRegisterSuccess}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NOTICE */}
      <Toast
        open={showToast}
        onClose={() => setShowToast(false)}
        type="success"
      >
        <p className="font-bold text-sm">{toastMessage}</p>
      </Toast>
    </>
  );
};

export default HomeHeader;
