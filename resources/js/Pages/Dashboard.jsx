import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { TASK_STATUS_CLASS_MAP, TASK_STATUS_TEXT_MAP } from "@/constants";
import { Head, Link } from "@inertiajs/react";

export default function Dashboard({
  auth,
  totalPendingTasks,
  myPendingTasks,
  totalProgressTasks,
  myProgressTasks,
  totalCompletedTasks,
  myCompletedTasks,
  activeTasks,
}) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Tableau de bord
        </h2>
      }
    >
      <Head title="Tableau de bord" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <SummaryCard
            title="Taches en attente"
            highlightClass="text-amber-500"
            current={myPendingTasks}
            total={totalPendingTasks}
          />
          <SummaryCard
            title="Taches en cours"
            highlightClass="text-blue-500"
            current={myProgressTasks}
            total={totalProgressTasks}
          />
          <SummaryCard
            title="Taches terminees"
            highlightClass="text-green-500"
            current={myCompletedTasks}
            total={totalCompletedTasks}
          />
        </div>

        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Mes taches actives
              </h3>

              <table className="mt-4 w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300 border-b-2 border-gray-500">
                  <tr>
                    <th className="px-3 py-3">ID</th>
                    <th className="px-3 py-3">Projet</th>
                    <th className="px-3 py-3">Tache</th>
                    <th className="px-3 py-3">Statut</th>
                    <th className="px-3 py-3">Echeance</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTasks.data.map((task) => (
                    <tr key={task.id}>
                      <td className="px-3 py-2">{task.id}</td>
                      <td className="px-3 py-2 text-white hover:underline">
                        <Link href={route("project.show", task.project.id)}>
                          {task.project.name}
                        </Link>
                      </td>
                      <td className="px-3 py-2 text-white hover:underline">
                        <Link href={route("project-manager.tasks.show", task.id)}>
                          {task.name}
                        </Link>
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={
                            "px-2 py-1 rounded text-nowrap text-white " +
                            TASK_STATUS_CLASS_MAP[task.status]
                          }
                        >
                          {TASK_STATUS_TEXT_MAP[task.status]}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-nowrap">{task.due_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

function SummaryCard({ title, highlightClass, current, total }) {
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
      <div className="p-6 text-gray-900 dark:text-gray-100">
        <h3 className={`text-2xl font-semibold ${highlightClass}`}>{title}</h3>
        <p className="text-xl mt-4">
          <span className="mr-2">{current}</span>
          <span className="text-sm text-gray-500">sur</span>
          <span className="ml-2">{total}</span>
        </p>
      </div>
    </div>
  );
}
