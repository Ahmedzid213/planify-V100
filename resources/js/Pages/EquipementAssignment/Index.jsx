import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";

const STATUS_BADGE_CLASSES = {
  in_service: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
  maintenance_due: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
  out_of_service: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
  retired: "bg-slate-500/15 text-slate-600 dark:text-slate-300",
};

export default function Index({
  auth,
  freeEquipements = [],
  inUseEquipements = [],
  users = [],
  success,
}) {
  const { data, setData, post, processing, errors } = useForm({
    equipement_id: "",
    user_id: "",
  });

  const { post: unassignPost, processing: unassignProcessing } = useForm();

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("equipement.assignment.assign"), {
      preserveScroll: true,
    });
  };

  const unassignEquipement = (equipementId) => {
    if (!confirm("Are you sure you want to unassign this equipment?")) {
      return;
    }

    unassignPost(route("equipement.assignment.unassign", equipementId), {
      preserveScroll: true,
    });
  };

  const statusBadge = (equipement) => (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${
        STATUS_BADGE_CLASSES[equipement.status] ?? "bg-slate-500/10 text-slate-500"
      }`}
    >
      {equipement.status_label}
    </span>
  );

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Equipment assignment
        </h2>
      }
    >
      <Head title="Equipment assignment" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {success && (
            <div className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100 space-y-6">
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Available equipment
                    </h3>
                    <select
                      name="equipement_id"
                      id="equipement_id"
                      value={data.equipement_id}
                      className="mt-2 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      onChange={(e) => setData("equipement_id", e.target.value)}
                    >
                      <option value="">Select a piece of equipment</option>
                      {freeEquipements.map((equipement) => (
                        <option
                          key={equipement.id}
                          value={equipement.id}
                          disabled={!equipement.assignable}
                        >
                          {equipement.name} — {equipement.status_label}
                          {!equipement.assignable ? " (not assignable)" : ""}
                        </option>
                      ))}
                    </select>
                    {errors.equipement_id && (
                      <p className="mt-2 text-sm text-rose-500">
                        {errors.equipement_id}
                      </p>
                    )}
                    {freeEquipements.length === 0 && (
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        No equipment is currently available.
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Users
                    </h3>
                    <select
                      name="user_id"
                      id="user_id"
                      value={data.user_id}
                      className="mt-2 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      onChange={(e) => setData("user_id", e.target.value)}
                    >
                      <option value="">Select a user</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                    {errors.user_id && (
                      <p className="mt-2 text-sm text-rose-500">{errors.user_id}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={processing}
                    className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600 disabled:opacity-60"
                  >
                    Assign equipment
                  </button>
                </div>
              </form>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Free equipment overview
                </h4>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {freeEquipements.map((equipement) => (
                    <div
                      key={equipement.id}
                      className="flex items-center justify-between rounded border border-gray-200 dark:border-gray-700 px-3 py-2"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800 dark:text-gray-100">
                          {equipement.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {equipement.id}
                        </span>
                      </div>
                      {statusBadge(equipement)}
                    </div>
                  ))}
                  {freeEquipements.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No free equipment.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Equipment in use
              </h3>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr>
                      <th className="px-3 py-3">Equipment</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Assigned to</th>
                      <th className="px-3 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inUseEquipements.length === 0 && (
                      <tr>
                        <td
                          className="px-3 py-4 text-center text-gray-500 dark:text-gray-400"
                          colSpan={4}
                        >
                          No equipment is currently assigned.
                        </td>
                      </tr>
                    )}
                    {inUseEquipements.map((equipement) => (
                      <tr key={equipement.id} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="px-3 py-3 text-gray-900 dark:text-gray-100">
                          {equipement.name}
                        </td>
                        <td className="px-3 py-3">{statusBadge(equipement)}</td>
                        <td className="px-3 py-3">
                          {equipement.user?.name ?? "Not specified"}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <button
                            onClick={() => unassignEquipement(equipement.id)}
                            disabled={unassignProcessing}
                            className="font-medium text-rose-500 hover:text-rose-400 disabled:opacity-50"
                          >
                            Unassign
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
