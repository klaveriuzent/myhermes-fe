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
              <Link
                to="/"
                aria-label="Hermes Agent"
                className="mb-6 flex items-center gap-4"
              >
                <img
                  src="/images/logo/hermes.webp"
                  alt=""
                  className="size-14 rounded-2xl border border-gray-200 object-cover shadow-theme-md dark:border-white/10"
                />
                <span className="flex flex-col text-[26px] font-bold leading-[24px] tracking-[0.18em]">
                  <span className="text-gray-900 dark:text-white">HERMES</span>
                  <span className="text-secondary-500">AGENT</span>
                </span>
              </Link>
              <p className="text-center text-gray-600 dark:text-white/60">
                Akses terbatas untuk memantau agent dan meninjau hasil
                automasi.
              </p>
              <div className="mt-7 flex items-center gap-2 text-theme-xs font-medium uppercase tracking-[0.18em] text-gray-400 dark:text-white/30">
                <span className="h-px w-6 bg-gray-300 dark:bg-white/15" />
                <span>
                  Powered by{" "}
                  <span className="text-secondary-600 dark:text-secondary-400">
                    Algoritmix
                  </span>
                </span>
                <span className="h-px w-6 bg-gray-300 dark:bg-white/15" />
              </div>
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
