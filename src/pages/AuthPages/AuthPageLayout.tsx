import React from "react";
import { Link } from "react-router";
import GridShape from "../../components/common/GridShape";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative bg-white z-1 dark:bg-gray-900">
      <div className="relative flex min-h-screen w-full flex-col justify-center lg:flex-row dark:bg-gray-900">
        {children}
        <div className="hidden min-h-screen w-full items-center bg-brand-50 lg:grid lg:w-1/2 dark:bg-white/5">
          <div className="relative flex items-center justify-center z-1">
            <GridShape />
            <div className="flex max-w-sm flex-col items-center px-8">
              <Link to="/" className="mb-5 block">
                <img
                  className="dark:hidden"
                  width={231}
                  height={48}
                  src="/images/logo/logo.svg"
                  alt="Hermes"
                />
                <img
                  className="hidden dark:block"
                  width={231}
                  height={48}
                  src="/images/logo/auth-logo.svg"
                  alt="Hermes"
                />
              </Link>
              <p className="text-center text-gray-600 dark:text-white/60">
                Hermes AI membantu agent bekerja, mengambil keputusan, dan
                menjalankan automasi dalam satu console.
              </p>
            </div>
          </div>
        </div>
        <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
