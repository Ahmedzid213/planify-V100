import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";

const STATUS_STYLES = {
  in_service: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
  maintenance_due: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
  out_of_service: "bg-slate-500/15 text-slate-600 dark:text-slate-300",
  retired: "bg-gray-500/15 text-gray-600 dark:text-gray-300",
};

const dueTextClass = (overdue) =>
  overdue
    ? "text-rose-500 dark:text-rose-300 font-semibold"
    : "text-gray-900 dark:text-gray-100";

export default function Index({
  auth,
  equipements,
  queryParams = null,
  success,
  statusOptions = [],
}) {
  queryParams = queryParams || {};

  const searchFieldChanged = (name, value) => {
    const updatedParams = { ...queryParams };

    if (value) {
      updatedParams[name] = value;
    } else {
      delete updatedParams[name];
    }

    router.get(route("equipement.index"), updatedParams, {
      preserveScroll: true,
      replace: true,
    });
  };

  const onKeyPress = (name, e) => {
    if (e.key !== "Enter") return;
    searchFieldChanged(name, e.target.value);
  };

  const sortChanged = (name) => {
    const updatedParams = { ...queryParams };
    if (name === updatedParams.sort_field) {
      updatedParams.sort_direction = updatedParams.sort_direction === "asc" ? "desc" : "asc";
    } else {
      updatedParams.sort_field = name;
      updatedParams.sort_direction = "asc";
    }

    router.get(route("equipement.index"), updatedParams, {
      preserveScroll: true,
      replace: true,
    });
  };

  const deleteEquipement = (equipement) => {
    if (!window.confirm("Supprimer cet equipement ?")) {
      return;
    }
    router.delete(route("equipement.destroy", equipement.id), {
      preserveScroll: true,
    });
  };

  const statusLabels = Object.fromEntries(
    statusOptions.map((option) => [option.value, option.label])
  );

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Equipements
          </h2>
          <Link
            href={route("equipement.create")}
            className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"
          >
            Ajouter un equipement
          </Link>
        </div>
      }
    >
      <Head title="Equipements" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {success && (
            <div className="bg-emerald-500 py-2 px-4 text-white rounded shadow mb-4">
              {success}
            </div>
          )}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    <tr className="text-nowrap">
                      <TableHeading
                        name="id"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        ID
                      </TableHeading>
                      <TableHeading
                        name="name"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Nom
                      </TableHeading>
                      <TableHeading
                        name="brand"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Marque
                      </TableHeading>
                      <TableHeading
                        name="reference"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Reference
                      </TableHeading>
                      <TableHeading
                        name="serial_number"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        N° serie
                      </TableHeading>
                      <TableHeading
                        name="status"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Statut
                      </TableHeading>
                      <TableHeading
                        name="next_maintenance_due_at"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Maintenance
                      </TableHeading>
                      <TableHeading
                        name="next_calibration_due_at"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Calibration
                      </TableHeading>
                      <TableHeading
                        name="created_at"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Cree le
                      </TableHeading>
                      <th className="px-3 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    <tr className="text-nowrap">
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.name}
                          placeholder="Recherche nom"
                          onBlur={(e) => searchFieldChanged("name", e.target.value)}
                          onKeyPress={(e) => onKeyPress("name", e)}
                        />
                      </th>
                      <th className="px-3 py-3">
                        <TextInput
                          className="w-full"
                          defaultValue={queryParams.brand}
                          placeholder="Recherche marque"
                          onBlur={(e) => searchFieldChanged("brand", e.target.value)}
                          onKeyPress={(e) => onKeyPress("brand", e)}
                        />
                      </th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3">
                        <SelectInput
                          value={queryParams.status || ""}
                          className="w-full"
                          onChange={(e) => searchFieldChanged("status", e.target.value)}
                        >
                          <option value="">Tous les statuts</option>
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </SelectInput>
                      </th>
                      <th className="px-3 py-3">
                        <SelectInput
                          value={queryParams.attention || ""}
                          className="w-full"
                          onChange={(e) => searchFieldChanged("attention", e.target.value)}
                        >
                          <option value="">Toutes</option>
                          <option value="overdue">Alerte</option>
                        </SelectInput>
                      </th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipements.data.map((equipement) => (
                      <tr
                        className="bg-white border-b border-gray-100 dark:bg-gray-800 dark:border-gray-700"
                        key={equipement.id}
                      >
                        <td className="px-3 py-3">{equipement.id}</td>
                        <td className="px-3 py-3 text-gray-900 dark:text-gray-100 text-nowrap hover:underline">
                          <Link href={route("equipement.show", equipement.id)}>
                            {equipement.name}
                          </Link>
                        </td>
                        <td className="px-3 py-3">{equipement.brand}</td>
                        <td className="px-3 py-3">{equipement.reference}</td>
                        <td className="px-3 py-3">{equipement.serial_number}</td>
                        <td className="px-3 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[equipement.status] ?? "bg-slate-500/15 text-slate-600"}`}
                          >
                            {statusLabels[equipement.status] ?? equipement.status}
                          </span>
                        </td>
                        <td className={`px-3 py-3 ${dueTextClass(equipement.maintenance_overdue)}`}>
                          {equipement.next_maintenance_due_at || "-"}
                        </td>
                        <td className={`px-3 py-3 ${dueTextClass(equipement.calibration_overdue)}`}>
                          {equipement.next_calibration_due_at || "-"}
                        </td>
                        <td className="px-3 py-3 text-nowrap">
                          {equipement.created_at}
                        </td>
                        <td className="px-3 py-3 text-nowrap text-right">
                          <Link
                            href={route("equipement.edit", equipement.id)}
                            className="font-medium text-blue-600 dark:text-blue-400 hover:underline mx-1"
                          >
                            Modifier
                          </Link>
                          <button
                            onClick={() => deleteEquipement(equipement)}
                            className="font-medium text-rose-500 hover:underline mx-1"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination links={equipements.meta.links} />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}