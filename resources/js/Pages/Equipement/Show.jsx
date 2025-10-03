import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useMemo, useState } from "react";

const STATUS_STYLES = {
  in_service: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
  maintenance_due: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
  out_of_service: "bg-slate-500/15 text-slate-600 dark:text-slate-300",
  retired: "bg-gray-500/15 text-gray-600 dark:text-gray-300",
};

const MAINTENANCE_STATUS_STYLES = {
  scheduled: "bg-blue-500/15 text-blue-600 dark:text-blue-300",
  completed: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
};

const formatDate = (value, fallback = "Non defini") => (value ? value : fallback);

export default function Show({
  auth,
  success,
  equipement,
  statusOptions = [],
  maintenanceTypes = [],
}) {
  const equipment = equipement.data;
  const statusLabels = useMemo(
    () =>
      Object.fromEntries(statusOptions.map((option) => [option.value, option.label])),
    [statusOptions]
  );
  const maintenanceTypeLabels = useMemo(
    () =>
      Object.fromEntries(
        maintenanceTypes.map((option) => [option.value, option.label])
      ),
    [maintenanceTypes]
  );
  const maintenances = equipment.maintenances || [];

  const scheduleForm = useForm({
    type: maintenanceTypes[0]?.value ?? "maintenance",
    scheduled_at: "",
    performed_by: "",
    notes: "",
  });

  const [completingId, setCompletingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const onScheduleSubmit = (e) => {
    e.preventDefault();
    scheduleForm.post(route("equipement.maintenance.store", equipment.id), {
      preserveScroll: true,
      onSuccess: () => scheduleForm.reset("scheduled_at", "performed_by", "notes"),
    });
  };

  const markComplete = (maintenance) => {
    if (!confirm("Marquer cette intervention comme terminee ?")) {
      return;
    }

    setCompletingId(maintenance.id);

    router.patch(
      route("equipement.maintenance.complete", [equipment.id, maintenance.id]),
      {
        completed_at: new Date().toISOString().slice(0, 10),
        performed_by: auth.user?.name ?? "",
        notes: maintenance.notes,
      },
      {
        preserveScroll: true,
        onFinish: () => setCompletingId(null),
      }
    );
  };

  const removeMaintenance = (maintenance) => {
    if (!confirm("Supprimer cette intervention ?")) {
      return;
    }

    setDeletingId(maintenance.id);
    router.delete(
      route("equipement.maintenance.destroy", [equipment.id, maintenance.id]),
      {
        preserveScroll: true,
        onFinish: () => setDeletingId(null),
      }
    );
  };

  const statusBadgeClass =
    STATUS_STYLES[equipment.status] ?? "bg-slate-500/15 text-slate-600";

  const maintenanceStatusBadge = (status, isOverdue) => {
    const base = MAINTENANCE_STATUS_STYLES[status] ?? "bg-slate-500/15 text-slate-600";
    if (status === "scheduled" && isOverdue) {
      return "bg-rose-500/15 text-rose-600 dark:text-rose-300";
    }

    return base;
  };

  const dueTextClass = (overdue) =>
    overdue
      ? "text-rose-500 dark:text-rose-300 font-semibold"
      : "text-gray-900 dark:text-gray-100";

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
              {`Equipement "${equipment.name}"`}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Numero de serie: {equipment.serial_number}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass}`}
            >
              {statusLabels[equipment.status] ?? equipment.status}
            </span>
            <Link
              href={route("equipement.edit", equipment.id)}
              className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"
            >
              Modifier
            </Link>
          </div>
        </div>
      }
    >
      <Head title={`Equipement "${equipment.name}"`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
          {success && (
            <div className="bg-emerald-500 py-2 px-4 text-white rounded shadow">
              {success}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
              <div className="p-6 space-y-6 text-gray-900 dark:text-gray-100">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <p className="font-bold text-sm uppercase text-gray-500 dark:text-gray-400 tracking-wide">
                        Identification
                      </p>
                      <p className="mt-1 text-lg font-semibold">{equipment.name}</p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Cree le {formatDate(equipment.created_at, "Date inconnue")}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        Marque
                      </p>
                      <p className="mt-1">{equipment.brand || "Non renseigne"}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        Reference
                      </p>
                      <p className="mt-1">{equipment.reference || "Non renseigne"}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        Date de mise en service
                      </p>
                      <p className="mt-1">{formatDate(equipment.commissioned_at)}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        Prochaine maintenance
                      </p>
                      <p className={`mt-1 ${dueTextClass(equipment.maintenance_overdue)}`}>
                        {formatDate(equipment.next_maintenance_due_at)}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        Prochaine calibration
                      </p>
                      <p className={`mt-1 ${dueTextClass(equipment.calibration_overdue)}`}>
                        {formatDate(equipment.next_calibration_due_at)}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        Derniere maintenance realisee
                      </p>
                      <p className="mt-1">
                        {formatDate(equipment.last_maintenance_completed_at)}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        Derniere calibration realisee
                      </p>
                      <p className="mt-1">
                        {formatDate(equipment.last_calibration_completed_at)}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    Frequence recurente
                  </p>
                  <div className="mt-2 grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Maintenance
                      </p>
                      <p className="mt-1">
                        {equipment.maintenance_interval_days
                          ? `${equipment.maintenance_interval_days} jours`
                          : "Non definie"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Calibration
                      </p>
                      <p className="mt-1">
                        {equipment.calibration_interval_days
                          ? `${equipment.calibration_interval_days} jours`
                          : "Non definie"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">Notes</p>
                  <p className="mt-1 text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {equipment.note || "Aucune remarque"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                <div className="p-6 text-gray-900 dark:text-gray-100 space-y-3">
                  <p className="font-semibold">Etiquette QR</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Scannez pour acceder a la fiche detaillee de l'equipement.
                  </p>
                  {equipment.qr_code_base64 ? (
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={`data:image/png;base64,${equipment.qr_code_base64}`}
                        alt={`QR code pour ${equipment.name}`}
                        className="w-40 h-40"
                      />
                      <a
                        href={`data:image/png;base64,${equipment.qr_code_base64}`}
                        download={`equipement-${equipment.id}-qr.png`}
                        className="text-sm text-emerald-500 hover:text-emerald-400"
                      >
                        Telecharger le QR code
                      </a>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Generation du QR code indisponible.
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                <div className="p-6 text-gray-900 dark:text-gray-100">
                  <p className="font-semibold mb-4">Programmer une intervention</p>
                  <form className="space-y-4" onSubmit={onScheduleSubmit}>
                    <div>
                      <InputLabel htmlFor="maintenance_type" value="Type" />
                      <SelectInput
                        id="maintenance_type"
                        name="type"
                        value={scheduleForm.data.type}
                        className="mt-1 block w-full"
                        onChange={(e) => scheduleForm.setData("type", e.target.value)}
                      >
                        {maintenanceTypes.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </SelectInput>
                      <InputError
                        message={scheduleForm.errors.type}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <InputLabel htmlFor="scheduled_at" value="Date planifiee" />
                      <TextInput
                        id="scheduled_at"
                        type="date"
                        name="scheduled_at"
                        value={scheduleForm.data.scheduled_at}
                        className="mt-1 block w-full"
                        onChange={(e) =>
                          scheduleForm.setData("scheduled_at", e.target.value)
                        }
                      />
                      <InputError
                        message={scheduleForm.errors.scheduled_at}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <InputLabel htmlFor="performed_by" value="Technicien (optionnel)" />
                      <TextInput
                        id="performed_by"
                        type="text"
                        name="performed_by"
                        value={scheduleForm.data.performed_by}
                        className="mt-1 block w-full"
                        onChange={(e) =>
                          scheduleForm.setData("performed_by", e.target.value)
                        }
                      />
                      <InputError
                        message={scheduleForm.errors.performed_by}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <InputLabel htmlFor="maintenance_notes" value="Notes" />
                      <TextAreaInput
                        id="maintenance_notes"
                        name="notes"
                        value={scheduleForm.data.notes}
                        className="mt-1 block w-full"
                        onChange={(e) => scheduleForm.setData("notes", e.target.value)}
                      />
                      <InputError
                        message={scheduleForm.errors.notes}
                        className="mt-2"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={scheduleForm.processing}
                        className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600 disabled:opacity-60"
                      >
                        Planifier
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold">Historique des interventions</p>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {maintenances.length} enregistrements
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="px-3 py-3">Type</th>
                      <th className="px-3 py-3">Date planifiee</th>
                      <th className="px-3 py-3">Statut</th>
                      <th className="px-3 py-3">Date terminee</th>
                      <th className="px-3 py-3">Technicien</th>
                      <th className="px-3 py-3">Notes</th>
                      <th className="px-3 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenances.length === 0 && (
                      <tr>
                        <td
                          className="px-3 py-4 text-center text-gray-500 dark:text-gray-400"
                          colSpan={7}
                        >
                          Aucune intervention planifiee pour le moment.
                        </td>
                      </tr>
                    )}
                    {maintenances.map((maintenance) => (
                      <tr
                        key={maintenance.id}
                        className="border-b border-gray-100 dark:border-gray-700"
                      >
                        <td className="px-3 py-3 font-medium text-gray-900 dark:text-gray-100">
                          {maintenanceTypeLabels[maintenance.type] ?? maintenance.type}
                        </td>
                        <td className={`px-3 py-3 ${dueTextClass(maintenance.is_overdue)}`}>
                          {formatDate(maintenance.scheduled_at)}
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${maintenanceStatusBadge(
                              maintenance.status,
                              maintenance.is_overdue
                            )}`}
                          >
                            {maintenance.status}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          {formatDate(maintenance.completed_at, "En attente")}
                        </td>
                        <td className="px-3 py-3">
                          {maintenance.performed_by || "Non renseigne"}
                        </td>
                        <td className="px-3 py-3 max-w-xs whitespace-pre-line">
                          {maintenance.notes || "-"}
                        </td>
                        <td className="px-3 py-3 text-right space-x-2">
                          {maintenance.status === "scheduled" && (
                            <>
                              <button
                                onClick={() => markComplete(maintenance)}
                                disabled={completingId === maintenance.id}
                                className="text-emerald-500 hover:text-emerald-400 disabled:opacity-50"
                              >
                                Terminer
                              </button>
                              <button
                                onClick={() => removeMaintenance(maintenance)}
                                disabled={deletingId === maintenance.id}
                                className="text-rose-500 hover:text-rose-400 disabled:opacity-50"
                              >
                                Supprimer
                              </button>
                            </>
                          )}
                          {maintenance.status === "completed" && (
                            <span className="text-gray-400 text-xs">Enregistre</span>
                          )}
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
