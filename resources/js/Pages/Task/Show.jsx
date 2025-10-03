import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
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
  const taskData = task.data;

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
            Editer
          </Link>
        </div>
      }
    >
      <Head title={`Task "${taskData.name}"`} />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div>
              <img
                src={taskData.image_path}
                alt=""
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="grid gap-1 grid-cols-2 mt-2">
                <div>
                  <div>
                    <label className="font-bold text-lg">ID de la tâche</label>
                    <p className="mt-1">{taskData.id}</p>
                  </div>
                  <div className="mt-4">
                    <label className="font-bold text-lg">Nom de la tâche</label>
                    <p className="mt-1">{taskData.name}</p>
                  </div>

                  <div className="mt-4">
                    <label className="font-bold text-lg">
                      Statut de la tâche
                    </label>
                    <p className="mt-1">
                      <span
                        className={
                          "px-2 py-1 rounded text-white " +
                          TASK_STATUS_CLASS_MAP[taskData.status]
                        }
                      >
                        {TASK_STATUS_TEXT_MAP[taskData.status]}
                      </span>
                    </p>
                  </div>

                  <div className="mt-4">
                    <label className="font-bold text-lg">
                      Priorité de la tâche
                    </label>
                    <p className="mt-1">
                      <span
                        className={
                          "px-2 py-1 rounded text-white " +
                          TASK_PRIORITY_CLASS_MAP[taskData.priority]
                        }
                      >
                        {TASK_PRIORITY_TEXT_MAP[taskData.priority]}
                      </span>
                    </p>
                  </div>
                  <div className="mt-4">
                    <label className="font-bold text-lg">Créé par</label>
                    <p className="mt-1">{taskData.createdBy.name}</p>
                  </div>
                </div>
                <div>
                  <div>
                    <label className="font-bold text-lg">Date d'échéance</label>
                    <p className="mt-1">{taskData.due_date}</p>
                  </div>
                  <div className="mt-4">
                    <label className="font-bold text-lg">
                      Date de création
                    </label>
                    <p className="mt-1">{taskData.created_at}</p>
                  </div>
                  <div className="mt-4">
                    <label className="font-bold text-lg">Modifié par</label>
                    <p className="mt-1">{taskData.updatedBy.name}</p>
                  </div>
                  <div className="mt-4">
                    <label className="font-bold text-lg">Projet</label>
                    <p className="mt-1">
                      <Link
                        href={route("project.show", taskData.project.id)}
                        className="hover:underline"
                      >
                        {taskData.project.name}
                      </Link>
                    </p>
                  </div>
                  <div className="mt-4">
                    <label className="font-bold text-lg">
                      Utilisateur assigné
                    </label>
                    <p className="mt-1">{taskData.assignedUser.name}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="font-bold text-lg">
                  Description de la tâche
                </label>
                <p className="mt-1">{taskData.description}</p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Files
            </h3>
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

