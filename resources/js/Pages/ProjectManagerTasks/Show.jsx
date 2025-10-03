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
            Task "{task.name}"
          </h2>
          <Link
            href={route("project-manager.tasks.edit", task.id)}
            className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition hover:bg-emerald-600"
          >
            Edit task
          </Link>
        </div>
      }
    >
      <Head title={`Task · ${task.name}`} />

      <div className="py-12">
        <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            {task.image_path && (
              <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
                <a
                  href={task.image_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-500"
                >
                  View attachment
                </a>
              </div>
            )}
            <div className="p-6 text-gray-900 dark:text-gray-100 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase text-gray-500">Task ID</p>
                    <p className="text-lg font-medium">{task.id}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500">Status</p>
                    <span className={`inline-flex mt-1 px-2 py-1 rounded text-white ${statusClass}`}>
                      {statusLabel}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500">Priority</p>
                    <span className={`inline-flex mt-1 px-2 py-1 rounded text-white ${priorityClass}`}>
                      {priorityLabel}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500">Created by</p>
                    <p className="text-lg font-medium">{task.createdBy?.name ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500">Assigned to</p>
                    <p className="text-lg font-medium">{task.assignedUser?.name ?? "Unassigned"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase text-gray-500">Due date</p>
                    <p className="text-lg font-medium">{task.due_date ?? "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500">Created on</p>
                    <p className="text-lg font-medium">{task.created_at}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500">Last updated by</p>
                    <p className="text-lg font-medium">{task.updatedBy?.name ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500">Project</p>
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
                <p className="mt-2 leading-relaxed">{task.description || "No description provided."}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
