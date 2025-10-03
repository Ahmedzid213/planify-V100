import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
  PROJECT_STATUS_CLASS_MAP,
  PROJECT_STATUS_TEXT_MAP,
} from "@/constants.jsx";
import TasksTable from "../ProjectManagerTasks/TasksTable";
import FileUpload from "@/Components/FileUpload";
import FileCard from "@/Components/FileCard";

export default function Show({ auth, success, project, tasks, queryParams }) {
  const handleDelete = (file) => {
    if (confirm("Are you sure you want to delete this file?")) {
      router.delete(route("file.destroy", file.id));
    }
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {`Project "${project.name}"`}
          </h2>
          <Link
            href={route("project.edit", project.id)}
            className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"
          >
            Modifier
          </Link>
        </div>
      }
    >
      <Head title={`Project "${project.name}"`} />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            {project.image_path && (
              <div>
                <img
                  src={project.image_path}
                  alt=""
                  className="w-full h-64 object-cover"
                />
              </div>
            )}
            <div className="p-6 text-gray-900 dark:text-gray-100 space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="font-bold text-lg">ID Projet</p>
                    <p className="mt-1">{project.id}</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg">Nom du Projet</p>
                    <p className="mt-1">{project.name}</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg">Statut du Projet</p>
                    <p className="mt-1">
                      <span
                        className={
                          "px-2 py-1 rounded text-white " +
                          PROJECT_STATUS_CLASS_MAP[project.status]
                        }
                      >
                        {PROJECT_STATUS_TEXT_MAP[project.status]}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-lg">Cree par</p>
                    <p className="mt-1">{project.createdBy?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg">Mis a jour par</p>
                    <p className="mt-1">{project.updatedBy?.name || "N/A"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="font-bold text-lg">Date de debut</p>
                    <p className="mt-1">
                      {project.start_date || "Non definie"}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-lg">Date d'echeance</p>
                    <p className="mt-1">{project.due_date || "Non definie"}</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg">Date de creation</p>
                    <p className="mt-1">{project.created_at}</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg">Chef de projet</p>
                    <p className="mt-1">
                      {project.manager ? (
                        <span>{`${project.manager.name} (${project.manager.email})`}</span>
                      ) : (
                        "N/A"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-bold text-lg">Informations client</p>
                <div className="mt-2 grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500">Nom</p>
                    <p>{project.client_name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{project.client_email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telephone</p>
                    <p>{project.client_phone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Adresse</p>
                    <p>{project.client_address || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-bold text-lg">Description du Projet</p>
                <p className="mt-1 whitespace-pre-line">
                  {project.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <TasksTable
                tasks={tasks}
                success={success}
                filters={queryParams || {}}
                showProjectColumn={false}
                showCreatedByColumn={false}
                showActions={false}
                enableFilters={false}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pb-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Fichiers
            </h3>
            <div className="mt-6 space-y-4">
              {project.files &&
                project.files.map((file) => (
                  <FileCard key={file.id} file={file} onDelete={handleDelete} />
                ))}
            </div>
            <div className="mt-6">
              <FileUpload fileableId={project.id} fileableType="project" />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
