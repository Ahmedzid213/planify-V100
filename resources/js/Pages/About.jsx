import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GuestLayout from "@/Layouts/GuestLayout";

export default function About({ auth }) {
  const Layout = auth.user ? AuthenticatedLayout : GuestLayout;

  return (
    <Layout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          A propos de nous
        </h2>
      }
    >
      <Head title="A propos de nous" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 md:p-12 text-gray-900 dark:text-gray-100">
              <h1 className="text-3xl font-bold mb-4 text-center">
                Meet the Team !
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 text-center">
                nous sommes une équipe de développeurs passionnés dédiée à la
                création de solutions logicielles innovantes. Notre objectif est
                de transformer des idées en produits numériques qui font une
                différence.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gray-300 dark:bg-gray-700"></div>
                  <h3 className="text-xl font-semibold">ZID AHMED</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    FULL STACK Developer
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gray-300 dark:bg-gray-700"></div>
                  <h3 className="text-xl font-semibold">FADLA WAIL</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    FULL STACK Developer
                  </p>
                </div>
              </div>

              <div className="mt-16">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  Notre Mission
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-center">
                  Notre mission est de permettre aux Ã©quipes d'atteindre leurs
                  objectifs en fournissant des logiciels de gestion de projet
                  intuitifs, flexibles et puissants. Nous croyons qu'avec les
                  bons outils, toute Ã©quipe peut accomplir des choses
                  incroyables.
                </p>

                <div className="mt-16">
                  <h2 className="text-2xl font-bold mb-4 text-center">
                    NOS REPOSITOIRES GITHUB
                  </h2>
                  <div className="flex justify-center">
                    <a
                      href="https://github.com/ahmedzid213/planify-v100"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        fill="currentColor"
                        className="bi bi-github"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.94-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
