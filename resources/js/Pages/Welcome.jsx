import { Link, Head } from "@inertiajs/react";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
  return (
    <>
      <Head title="Bienvenue" />

      <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="sm:fixed sm:top-0 sm:right-0 p-6 text-end">
          {auth.user ? (
            <Link
              href={route("dashboard")}
              className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
            >
              Tableau de bord
            </Link>
          ) : (
            <>
              <Link
                href={route("login")}
                className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
              >
                Connexion
              </Link>

              <Link
                href={route("register")}
                className="ms-4 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500"
              >
                Inscription
              </Link>
            </>
          )}
        </div>

        <div className="max-w-5xl mx-auto px-6 py-24 lg:py-32 text-gray-900 dark:text-gray-100">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Pilotez vos projets avec Planify
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Planifiez les taches, suivez l'avancement et partagez les informations clefs avec vos equipes techniques, chefs de projet et techniciens.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <WelcomeCard
              title="Vue globale"
              description="Gardez une vision claire de la charge de travail et des priorites grace a des tableaux adaptes a chaque role."
            />
            <WelcomeCard
              title="Suivi des taches"
              description="Attribuez les actions, controlez les dates limites et communiquez les retours en un seul endroit."
            />
            <WelcomeCard
              title="Gestion du materiel"
              description="Identifiez les equipements disponibles, planifiez les interventions et assurez leur bonne utilisation."
            />
          </div>

          <div className="mt-16 bg-white/80 dark:bg-gray-800/80 rounded-xl p-8 shadow-sm">
            <h2 className="text-lg font-semibold">Fonctionnalites principales</h2>
            <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>- Navigation adaptee aux profils: administrateur, responsable technique, chef de projet et technicien.</li>
              <li>- Outils de suivi du travail: listes de taches, filtres, notifications et tableaux de bord clairs.</li>
              <li>- Support des operations: creation de projets, gestion des equipements et centralisation des documents. </li>
            </ul>
          </div>

          <div className="mt-16 flex flex-col items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Laravel v{laravelVersion} / PHP v{phpVersion}</span>
            <span>Copyright {new Date().getFullYear()} Planify - Tous droits reserves.</span>
          </div>
        </div>
      </div>
    </>
  );
}

function WelcomeCard({ title, description }) {
  return (
    <div className="rounded-xl bg-white/80 dark:bg-gray-800/80 p-6 shadow-sm">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}
