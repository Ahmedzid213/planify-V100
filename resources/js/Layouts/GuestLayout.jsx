import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function Guest({ children }) {
  return (
    <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <Link href={route("dashboard")}>
          <img
            src="/images/logo.jpg"
            alt="Logo de l'application"
            className="h-20 w-auto inline-block"
          />
        </Link>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300 font-semibold">
          Vision maitrisee.
        </p>
      </div>

      <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
        {children}
      </div>
      <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6">
        Copyright {new Date().getFullYear()} Planify (PFE ZID AHMED + FADLA WAIL RACHAD). Tous droits reserves.
      </div>
    </div>
  );
}
