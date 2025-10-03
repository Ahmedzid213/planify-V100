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
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {task.name}
          </h2>
          <Link
            href={route("technician.tasks.index")}
            className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-500"
          >
            <span aria-hidden>←</span>
            Retour
          </Link>
        </div>
      }
    >
      <Head title={`Ma tâche · ${task.name}`} />

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
                  Télécharger la pièce jointe
                </a>
              </div>
            )}
            <div className="p-6 space-y-6 text-gray-900 dark:text-gray-100">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase text-gray-500">Projet</p>
                    <p className="text-lg font-medium">{task.project?.name ?? "—"}</p>
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
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase text-gray-500">Échéance</p>
                    <p className="text-lg font-medium">{task.due_date ?? "Non définie"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500">Créée par</p>
                    <p className="text-lg font-medium">{task.createdBy?.name ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500">Chef de projet</p>
                    <p className="text-lg font-medium">{task.project?.manager?.name ?? "—"}</p>
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
