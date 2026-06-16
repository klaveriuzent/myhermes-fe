import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { completeSsoLogin, storeLastAuthUser } from "../../features/auth/api";

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function finishLogin() {
      const code = searchParams.get("code") ?? "";
      const state = searchParams.get("state") ?? "";

      if (!code) {
        setErrorMessage("Callback login tidak valid.");
        return;
      }

      try {
        const response = await completeSsoLogin(code, state);
        storeLastAuthUser(response.data);
        if (!cancelled) {
          navigate("/", { replace: true });
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Login gagal. Silakan coba lagi.",
          );
        }
      }
    }

    finishLogin();

    return () => {
      cancelled = true;
    };
  }, [navigate, searchParams]);

  return (
    <>
      <PageMeta
        title="Hermes AI | Login Callback"
        description="Completing OneAuth login."
      />
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
        <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {errorMessage ? "Login gagal" : "Menyelesaikan login"}
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {errorMessage || "Mohon tunggu sebentar."}
          </p>
          {errorMessage ? (
            <Link
              to="/login"
              className="mt-5 inline-flex rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              Kembali ke Login
            </Link>
          ) : null}
        </section>
      </main>
    </>
  );
}
