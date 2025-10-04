import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TaskChecklist from "@/Components/TaskChecklist";
import { Head, Link, router } from "@inertiajs/react";
import {
  TASK_PRIORITY_CLASS_MAP,
  TASK_PRIORITY_TEXT_MAP,
  TASK_STATUS_CLASS_MAP,
  TASK_STATUS_TEXT_MAP,
} from "@/constants.jsx";
import FileUpload from "@/Components/FileUpload";
import FileCard from "@/Components/FileCard";

export default function Show({ auth, task }) {
  const taskData = task?.data ?? task;

  const statusClass = TASK_STATUS_CLASS_MAP[taskData.status] ?? "bg-gray-500";
  const statusLabel = TASK_STATUS_TEXT_MAP[taskData.status] ?? taskData.status;
  const priorityClass = TASK_PRIORITY_CLASS_MAP[taskData.priority] ?? "bg-gray-500";
  const priorityLabel = TASK_PRIORITY_TEXT_MAP[taskData.priority] ?? taskData.priority;

  const handleDelete = (file) => {
    if (confirm("Are you sure you want to delete this file?")) {
      router.delete(route("file.destroy", file.id), {
        preserveScroll: true,
      });
    }
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {`Task "${taskData.name}"`}
          </h2>
          <Link
            href={route("task.edit", taskData.id)}
            className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"
          >
            Edit
          </Link>
        </div>
      }
    >
      <Head title={`Task - ${taskData.name}`} />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            {taskData.image_path && (
              <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <img
                  src={taskData.image_path}
                  alt="Task cover"
                  className="w-full h-64 object-cover"
                />
              </div>
            )}
            <div className="p-6 text-gray-900 dark:text-gray-100 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase text-gray-500">Task ID</p>
                    <p className="mt-1 text-lg font-medium">{taskData.id}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500">Name</p>
                    <p className="mt-1 text-lg font-medium">{taskData.name}</p>
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
                    <p className="mt-1 text-lg font-medium">{taskData.createdBy?.name ?? "Unknown"}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase text-gray-500">Due date</p>
                    <p className="mt-1 text-lg font-medium">{taskData.due_date ?? "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500">Created on</p>
                    <p className="mt-1 text-lg font-medium">{taskData.created_at}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500">Last updated by</p>
                    <p className="mt-1 text-lg font-medium">{taskData.updatedBy?.name ?? "Unknown"}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500">Project</p>
                    {taskData.project ? (
                      <Link
                        href={route("project.show", taskData.project.id)}
                        className="text-lg font-medium text-emerald-600 hover:text-emerald-500"
                      >
                        {taskData.project.name}
                      </Link>
                    ) : (
                      <p className="mt-1 text-lg font-medium">Unknown</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500">Assigned user</p>
                    <p className="mt-1 text-lg font-medium">{taskData.assignedUser?.name ?? "Unassigned"}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase text-gray-500">Description</p>
                <p className="mt-2 leading-relaxed">{taskData.description || "No description provided."}</p>
              </div>
            </div>
          </div>

          <TaskChecklist task={taskData} authUser={auth.user} />

          <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Files</h3>
            <div className="mt-6 space-y-4">
              {taskData.files &&
                taskData.files.map((file) => (
                  <FileCard key={file.id} file={file} onDelete={handleDelete} />
                ))}
            </div>
            <div className="mt-6">
              <FileUpload fileableId={taskData.id} fileableType="task" />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}