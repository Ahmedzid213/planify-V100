import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Pagination from "@/Components/Pagination";
import { Head, Link, router } from "@inertiajs/react";
import {
  TASK_PRIORITY_CLASS_MAP,
  TASK_PRIORITY_TEXT_MAP,
  TASK_STATUS_CLASS_MAP,
  TASK_STATUS_TEXT_MAP,
} from "@/constants.jsx";
import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";

export default function Index({ auth, tasks, filters = {} }) {
  const applyFilter = (name, value) => {
    const params = { ...filters };

    if (value) {
      params[name] = value;
    } else {
      delete params[name];
    }

    router.get(route("technician.tasks.index"), params, {
      preserveState: true,
      replace: true,
    });
  };

  const handleSearchKey = (event) => {
    if (event.key !== "Enter") {
      return;
    }

    applyFilter("name", event.target.value.trim());
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
              Mes tâches
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Toutes les tâches qui vous sont assignées par vos chefs de projet.
            </p>
          </div>
        </div>
      }
    >
      <Head title="Mes tâches" />

      <div className="py-12">
        <div className="max-w-6xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <TextInput
                type="search"
                placeholder="Rechercher une tâche"
                defaultValue={filters.name ?? ""}
                onKeyPress={handleSearchKey}
                onBlur={(event) => applyFilter("name", event.target.value.trim())}
                className="w-full"
              />

              <SelectInput
                value={filters.status ?? ""}
                onChange={(event) => applyFilter("status", event.target.value)}
                className="w-full"
              >
                <option value="">Statut</option>
                <option value="pending">En attente</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminée</option>
              </SelectInput>

              <SelectInput
                value={filters.priority ?? ""}
                onChange={(event) => applyFilter("priority", event.target.value)}
                className="w-full"
              >
                <option value="">Priorité</option>
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
              </SelectInput>
            </div>

            {tasks.data.length === 0 ? (
              <div className="rounded border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center text-sm text-gray-500 dark:text-gray-300">
                Aucune tâche ne vous a encore été assignée.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {tasks.data.map((task) => {
                  const statusClass = TASK_STATUS_CLASS_MAP[task.status] ?? "bg-gray-500";
                  const statusLabel = TASK_STATUS_TEXT_MAP[task.status] ?? task.status;
                  const priorityClass = TASK_PRIORITY_CLASS_MAP[task.priority] ?? "bg-gray-500";
                  const priorityLabel = TASK_PRIORITY_TEXT_MAP[task.priority] ?? task.priority;

                  return (
                    <div key={task.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase text-gray-500">Projet</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {task.project?.name ?? "—"}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-white text-xs ${statusClass}`}>
                          {statusLabel}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {task.name}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                        {task.description || "Pas de description."}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>
                          Priorité :
                          <span className={`ml-2 px-2 py-1 rounded text-white ${priorityClass}`}>
                            {priorityLabel}
                          </span>
                        </span>
                        <span>Échéance : {task.due_date ?? "Non définie"}</span>
                      </div>

                      <div className="flex justify-end">
                        <Link
                          href={route("technician.tasks.show", task.id)}
                          className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-500"
                        >
                          Voir les détails
                          <span aria-hidden>→</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <Pagination links={tasks.meta.links} />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
