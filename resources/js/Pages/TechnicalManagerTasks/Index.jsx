import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SelectInput from "@/Components/SelectInput";
import { Head, router } from "@inertiajs/react";
import TasksTable from "../ProjectManagerTasks/TasksTable";

export default function Index({
  auth,
  tasks,
  filters = {},
  technicians = [],
  projectManagers = [],
}) {
  const updateFilter = (name, value) => {
    const params = { ...filters };

    if (value) {
      params[name] = value;
    } else {
      delete params[name];
    }

    router.get(route("technical-manager.tasks.index"), params, {
      preserveState: true,
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
              Tous les tâches
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Consultez les tâches suivies par les project managers et techniciens.
            </p>
          </div>
        </div>
      }
    >
      <Head title="Tous les tâches" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <SelectInput
                  value={filters.assigned_user_id ?? ""}
                  onChange={(event) => updateFilter("assigned_user_id", event.target.value)}
                  className="w-full"
                >
                  <option value="">Techniciens</option>
                  {technicians.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </SelectInput>

                <SelectInput
                  value={filters.project_manager_id ?? ""}
                  onChange={(event) => updateFilter("project_manager_id", event.target.value)}
                  className="w-full"
                >
                  <option value="">Project managers</option>
                  {projectManagers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name}
                    </option>
                  ))}
                </SelectInput>

                <SelectInput
                  value={filters.priority ?? ""}
                  onChange={(event) => updateFilter("priority", event.target.value)}
                  className="w-full"
                >
                  <option value="">Priorité</option>
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                </SelectInput>
              </div>

              <TasksTable
                tasks={tasks}
                filters={filters}
                baseRoute="technical-manager.tasks"
                showActions={false}
              />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
