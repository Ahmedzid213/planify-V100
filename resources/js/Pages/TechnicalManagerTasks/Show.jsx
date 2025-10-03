import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
  TASK_PRIORITY_CLASS_MAP,
  TASK_PRIORITY_TEXT_MAP,
  TASK_STATUS_CLASS_MAP,
  TASK_STATUS_TEXT_MAP,
} from "@/constants.jsx";
import { Head, Link } from "@inertiajs/react";

export default function Show({ auth, task }) {
  const statusClass = TASK_STATUS_CLASS_MAP[task.status] ?? "bg-gray-500";
  const statusLabel = TASK_STATUS_TEXT_MAP[task.status] ?? task.status;
  const priorityClass = TASK_PRIORITY_CLASS_MAP[task.priority] ?? "bg-gray-500";
  const priorityLabel = TASK_PRIORITY_TEXT_MAP[task.priority] ?? task.priority;

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Tâche "{task.name}"
        </h2>
      }
    >
      <Head title={`Tâche · ${task.name}`} />

      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            {task.image_path && (
              <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
                <a
                  href={task.image_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-500"
                >
                  Consulter la pièce jointe
                </a>
              </div>
            )}
            <div className="p-6 space-y-6 text-gray-900 dark:text-gray-100">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase text-gray-500">Identifiant</p>
                    <p className="text-lg font-medium">{task.id}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500">Statut</p>
                    <span className={`inline-flex mt-1 px-2 py-1 rounded text-white ${statusClass}`}>
                      {statusLabel}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500">Priorité</p>
                    <span className={`inline-flex mt-1 px-2 py-1 rounded text-white ${priorityClass}`}>
                      {priorityLabel}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500">Assignée à</p>
                    <p className="text-lg font-medium">{task.assignedUser?.name ?? "Non assignée"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase text-gray-500">Date limite</p>
                    <p className="text-lg font-medium">{task.due_date ?? "Non définie"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500">Créée le</p>
                    <p className="text-lg font-medium">{task.created_at}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500">Créée par</p>
                    <p className="text-lg font-medium">{task.createdBy?.name ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500">Projet</p>
                    {task.project ? (
                      <Link
                        href={route("project.show", task.project.id)}
                        className="text-lg font-medium text-emerald-600 hover:text-emerald-500"
                      >
                        {task.project.name}
                      </Link>
                    ) : (
                      <p className="text-lg font-medium">—</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase text-gray-500">Description</p>
                <p className="mt-2 leading-relaxed">{task.description || "Aucune description fournie."}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
