// @ts-nocheck
"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <>
      <header>
        {/* Desktop Menu */}
        <div className="web-menu hidden md:block">
          <div className="top-bar border-b border-[#eaeaea]">
            <div className="menu-wrap menu-row flex justify-end items-center min-h-[30px] mx-auto max-w-[1240px] px-5">
              <ul className="flex items-center gap-2 text-[#282a88] text-xs font-medium font-sans">
                <li>
                  <Link
                    href="https://hackathon.bugcrusher.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600"
                  >
                    Login to Hackathon
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="menu-bar menu-row flex justify-between items-center min-h-[80px] mx-auto max-w-[1240px] px-5">
            <div className="logo">
              <Link
              href="http://bugcrusher.net"
              >
              <Image
                src="/logo.png"
                alt="BugCrusher Logo"
                width={125}
                height={125}
                priority
              />
              </Link>
            </div>
            <div className="menu-link">
              <ul className="flex items-center gap-4">
                <li>
                  <Link
                    href="https://bugcrusher.net/#about"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#282a88] font-bold text-base font-roboto hover:text-blue-600 px-4"
                  >
                    About Competition
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://bugcrusher.net/#competition-details"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#282a88] font-bold text-base font-roboto hover:text-blue-600 px-4"
                  >
                    Competition Details
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://bugcrusher.net/#keydates"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#282a88] font-bold text-base font-roboto hover:text-blue-600 px-4"
                  >
                    Key Dates
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://bugcrusher.net/#prizes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#282a88] font-bold text-base font-roboto hover:text-blue-600 px-4"
                  >
                    Prizes
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://bugcrusher.net/#faqs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#282a88] font-bold text-base font-roboto hover:text-blue-600 px-4"
                  >
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://bugcrusher.net/results/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#282a88] font-bold text-base font-roboto hover:text-blue-600 px-4"
                  >
                    Results
                  </Link>
                </li>
                <li>
                  <Link
                    href="http://challenge.bugcrusher.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#282a88] font-bold text-base font-roboto hover:text-blue-600 px-4"
                  >
                    Registration Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile Bar */}
        <div className="mob-bar md:hidden">
          <div className="menu-bar menu-row flex justify-between items-center min-h-[80px] mx-auto max-w-[1240px] px-5 border-b border-[#eaeaea]">
            <div className="logo">
              <Image
                src="/logo.png"
                alt="BugCrusher Logo"
                width={125}
                height={125}
                priority
              />
            </div>
            <div
              className="hamburger-menu cursor-pointer"
              onClick={toggleMobileMenu}
            >
              <Link href="#mob1">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="5" y="10" width="30" height="4" rx="2" fill="#000" />
                  <rect x="5" y="18" width="30" height="4" rx="2" fill="#000" />
                  <rect x="5" y="26" width="30" height="4" rx="2" fill="#000" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`mobile-menu fixed inset-0 bg-white z-50 flex flex-col md:hidden transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mob-bar menu-bar flex justify-between items-center min-h-[80px] w-full max-w-[1240px] px-5 border-b border-[#eaeaea]">
            <div className="logo flex-shrink-0">
              <Image
                src="/logo.png"
                alt="BugCrusher Logo"
                width={125}
                height={125}
                priority
              />
            </div>
            <div
              className="hamburger-menu cursor-pointer flex-shrink-0"
              onClick={toggleMobileMenu}
            >
              <Link href="#">
                <svg
                  className="close-icon"
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="8"
                    y1="8"
                    x2="32"
                    y2="32"
                    stroke="black"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <line
                    x1="8"
                    y1="32"
                    x2="32"
                    y2="8"
                    stroke="black"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
          <div className="menu-link flex-1 flex items-center justify-center mt-8">
            {" "}
            <ul className="flex flex-col items-center gap-4 text-center">
              <li>
                <Link
                  href="https://bugcrusher.net/#about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#282a88] font-bold text-base font-roboto hover:text-blue-600 px-2.5 py-2.5"
                >
                  About Competition
                </Link>
              </li>
              <li>
                <Link
                  href="https://bugcrusher.net/#competition-details"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#282a88] font-bold text-base font-roboto hover:text-blue-600 px-2.5 py-2.5"
                >
                  Competition Details
                </Link>
              </li>
              <li>
                <Link
                  href="https://bugcrusher.net/#keydates"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#282a88] font-bold text-base font-roboto hover:text-blue-600 px-2.5 py-2.5"
                >
                  Key Dates
                </Link>
              </li>
              <li>
                <Link
                  href="https://bugcrusher.net/#prizes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#282a88] font-bold text-base font-roboto hover:text-blue-600 px-2.5 py-2.5"
                >
                  Prizes
                </Link>
              </li>
              <li>
                <Link
                  href="https://bugcrusher.net/#faqs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#282a88] font-bold text-base font-roboto hover:text-blue-600 px-2.5 py-2.5"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="https://bugcrusher.net/results/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#282a88] font-bold text-base font-roboto hover:text-blue-600 px-2.5 py-2.5"
                >
                  Results
                </Link>
              </li>
              <li>
                <Link
                  href="http://challenge.bugcrusher.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#282a88] font-bold text-base font-roboto hover:text-blue-600 px-2.5 py-2.5"
                >
                  Registration Status
                </Link>
              </li>
            </ul>
          </div>
          <div className="login-mobile border-t border-[#eaeaea]">
            <div className="menu-link">
              <ul className="flex flex-col items-center gap-2 text-center">
                <li>
                  <Link
                    href="https://hackathon.bugcrusher.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#a8a8a8] text-xs font-medium font-sans hover:text-blue-600 py-2.5 px-2.5"
                  >
                    Login to Hackathon
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
