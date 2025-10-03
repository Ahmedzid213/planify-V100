import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import {
  PROJECT_STATUS_CLASS_MAP,
  PROJECT_STATUS_TEXT_MAP,
} from "@/constants.jsx";
import { Head, Link, router } from "@inertiajs/react";

export default function Index({ auth, projects, filters = {} }) {
  const applyFilter = (name, value) => {
    const params = { ...(filters || {}) };

    if (value) {
      params[name] = value;
    } else {
      delete params[name];
    }

    router.get(route("my-projects.index"), params, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  const handleSearchKey = (event) => {
    if (event.key !== "Enter") {
      return;
    }

    applyFilter("search", event.target.value.trim());
  };

  const resetFilters = () => {
    router.get(route("my-projects.index"), {}, {
      preserveState: false,
      replace: true,
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
              My projects
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Browse the projects that are assigned to you.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TextInput
              type="search"
              placeholder="Search by name"
              defaultValue={filters?.search ?? ""}
              onKeyPress={handleSearchKey}
              onBlur={(event) => applyFilter("search", event.target.value.trim())}
              className="w-full sm:w-56"
            />
            <SelectInput
              value={filters?.status ?? ""}
              onChange={(event) => applyFilter("status", event.target.value)}
              className="w-40"
            >
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In progress</option>
              <option value="completed">Completed</option>
            </SelectInput>
            <button
              type="button"
              onClick={resetFilters}
              className="border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-200 py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Reset
            </button>
          </div>
        </div>
      }
    >
      <Head title="My projects" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="space-y-6">
            {projects.data.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-8 text-center text-gray-600 dark:text-gray-300">
                No projects are currently assigned to you.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {projects.data.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6 flex flex-col gap-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Start date {project.start_date || "Not set"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Client {project.client_name || "—"}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium text-white ${PROJECT_STATUS_CLASS_MAP[project.status]}`}
                      >
                        {PROJECT_STATUS_TEXT_MAP[project.status]}
                      </span>
                    </div>

                    {project.image_path && (
                      <img
                        src={project.image_path}
                        alt={`Project ${project.name}`}
                        className="h-32 w-full object-cover rounded"
                      />
                    )}

                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {project.description || "No description available."}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-200">
                          Due date:
                        </span>{" "}
                        {project.due_date || "Not set"}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-200">
                          Client email:
                        </span>{" "}
                        {project.client_email || "—"}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Link
                        href={route("my-projects.show", project.id)}
                        className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-500"
                      >
                        View details
                        <span aria-hidden="true">&gt;</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {projects.meta?.links && projects.meta.links.length > 0 && (
              <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-4">
                <Pagination links={projects.meta.links} />
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
