import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
  PROJECT_STATUS_CLASS_MAP,
  PROJECT_STATUS_TEXT_MAP,
  TASK_PRIORITY_CLASS_MAP,
  TASK_PRIORITY_TEXT_MAP,
  TASK_STATUS_CLASS_MAP,
  TASK_STATUS_TEXT_MAP,
} from "@/constants.jsx";
import { Head, Link } from "@inertiajs/react";

export default function Show({ auth, project, tasks }) {
  const projectTasks = Array.isArray(tasks?.data)
    ? tasks.data
    : Array.isArray(tasks)
    ? tasks
    : [];

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
              {project.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Review the key information and the active tasks for this project.
            </p>
          </div>
          <Link
            href={route("my-projects.index")}
            className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-500"
          >
            Back to my projects
          </Link>
        </div>
      }
    >
      <Head title={`Project · ${project.name}`} />

      <div className="py-12">
        <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium text-white ${PROJECT_STATUS_CLASS_MAP[project.status]}`}
                  >
                    {PROJECT_STATUS_TEXT_MAP[project.status]}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-300">
                    Due date: {project.due_date || "Not set"}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-300">
                    Start date: {project.start_date || "Not set"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    Created on:
                  </span>{" "}
                  {project.created_at}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    Created by:
                  </span>{" "}
                  {project.createdBy?.name ?? "Unknown"}
                </p>
                {project.updatedBy && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      Last updated by:
                    </span>{" "}
                    {project.updatedBy?.name}
                  </p>
                )}
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    Client:
                  </span>{" "}
                  {project.client_name || "—"}
                </div>
                <div className="grid gap-1 text-sm text-gray-600 dark:text-gray-300">
                  <span>Email: {project.client_email || "—"}</span>
                  <span>Téléphone: {project.client_phone || "—"}</span>
                  <span>Adresse: {project.client_address || "—"}</span>
                </div>
              </div>
              {project.image_path && (
                <img
                  src={project.image_path}
                  alt={`Project ${project.name}`}
                  className="w-full max-w-xs rounded-md object-cover"
                />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Description
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 whitespace-pre-line">
                {project.description || "No description provided."}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Related tasks
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-300">
                  {projectTasks.length} task{projectTasks.length === 1 ? "" : "s"}
                </span>
              </div>

              {projectTasks.length === 0 ? (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  There are no tasks yet for this project.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
                      <tr>
                        <th className="px-3 py-2 text-left">Name</th>
                        <th className="px-3 py-2 text-left">Status</th>
                        <th className="px-3 py-2 text-left">Priority</th>
                        <th className="px-3 py-2 text-left">Due date</th>
                        <th className="px-3 py-2 text-left">Assigned to</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {projectTasks.map((task) => {
                        const statusClass = TASK_STATUS_CLASS_MAP[task.status] ?? "bg-gray-500";
                        const statusLabel = TASK_STATUS_TEXT_MAP[task.status] ?? "Unknown";
                        const priorityClass = TASK_PRIORITY_CLASS_MAP[task.priority] ?? "bg-gray-500";
                        const priorityLabel = TASK_PRIORITY_TEXT_MAP[task.priority] ?? "Not set";

                        return (
                          <tr key={task.id} className="text-gray-700 dark:text-gray-200">
                            <td className="px-3 py-2 font-medium">{task.name}</td>
                            <td className="px-3 py-2">
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium text-white ${statusClass}`}
                              >
                                {statusLabel}
                              </span>
                            </td>
                            <td className="px-3 py-2">
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium text-white ${priorityClass}`}
                              >
                                {priorityLabel}
                              </span>
                            </td>
                            <td className="px-3 py-2">{task.due_date || "Not set"}</td>
                            <td className="px-3 py-2">
                              {task.assignedUser?.name ?? "Unassigned"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
