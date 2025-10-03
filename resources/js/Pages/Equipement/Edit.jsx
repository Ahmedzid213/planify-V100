import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Edit({ auth, equipement, statusOptions = [] }) {
  const statusLookup = statusOptions.map((option) => option.value);
  const defaultStatus = statusLookup.includes(equipement.data.status)
    ? equipement.data.status
    : statusOptions[0]?.value ?? "in_service";

  const { data, setData, post, processing, errors } = useForm({
    name: equipement.data.name || "",
    brand: equipement.data.brand || "",
    reference: equipement.data.reference || "",
    serial_number: equipement.data.serial_number || "",
    note: equipement.data.note || "",
    commissioned_at: equipement.data.commissioned_at || "",
    status: defaultStatus,
    next_maintenance_due_at: equipement.data.next_maintenance_due_at || "",
    next_calibration_due_at: equipement.data.next_calibration_due_at || "",
    maintenance_interval_days:
      equipement.data.maintenance_interval_days ?? "",
    calibration_interval_days:
      equipement.data.calibration_interval_days ?? "",
    _method: "PUT",
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("equipement.update", equipement.data.id), {
      preserveScroll: true,
    });
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Modifier l'equipement "{equipement.data.name}"
          </h2>
        </div>
      }
    >
      <Head title="Equipements" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg space-y-8"
            >
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <InputLabel htmlFor="equipement_name" value="Nom de l'equipement" />
                    <TextInput
                      id="equipement_name"
                      type="text"
                      name="name"
                      value={data.name}
                      className="mt-1 block w-full"
                      isFocused={true}
                      onChange={(e) => setData("name", e.target.value)}
                    />
                    <InputError message={errors.name} className="mt-2" />
                  </div>
                  <div>
                    <InputLabel htmlFor="equipement_brand" value="Marque" />
                    <TextInput
                      id="equipement_brand"
                      type="text"
                      name="brand"
                      value={data.brand}
                      className="mt-1 block w-full"
                      onChange={(e) => setData("brand", e.target.value)}
                    />
                    <InputError message={errors.brand} className="mt-2" />
                  </div>
                  <div>
                    <InputLabel htmlFor="equipement_reference" value="Reference" />
                    <TextInput
                      id="equipement_reference"
                      type="text"
                      name="reference"
                      value={data.reference}
                      className="mt-1 block w-full"
                      onChange={(e) => setData("reference", e.target.value)}
                    />
                    <InputError message={errors.reference} className="mt-2" />
                  </div>
                  <div>
                    <InputLabel htmlFor="equipement_serial_number" value="Numero de serie" />
                    <TextInput
                      id="equipement_serial_number"
                      type="text"
                      name="serial_number"
                      value={data.serial_number}
                      className="mt-1 block w-full"
                      onChange={(e) => setData("serial_number", e.target.value)}
                    />
                    <InputError message={errors.serial_number} className="mt-2" />
                  </div>
                  <div>
                    <InputLabel htmlFor="equipement_note" value="Remarques" />
                    <TextAreaInput
                      id="equipement_note"
                      name="note"
                      value={data.note}
                      className="mt-1 block w-full"
                      onChange={(e) => setData("note", e.target.value)}
                    />
                    <InputError message={errors.note} className="mt-2" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <InputLabel htmlFor="equipement_status" value="Statut" />
                    <SelectInput
                      id="equipement_status"
                      name="status"
                      value={data.status}
                      className="mt-1 block w-full"
                      onChange={(e) => setData("status", e.target.value)}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </SelectInput>
                    <InputError message={errors.status} className="mt-2" />
                  </div>
                  <div>
                    <InputLabel htmlFor="equipement_commissioned_at" value="Date de mise en service" />
                    <TextInput
                      id="equipement_commissioned_at"
                      type="date"
                      name="commissioned_at"
                      value={data.commissioned_at}
                      className="mt-1 block w-full"
                      onChange={(e) => setData("commissioned_at", e.target.value)}
                    />
                    <InputError message={errors.commissioned_at} className="mt-2" />
                  </div>
                  <div>
                    <InputLabel htmlFor="equipement_next_maintenance_due_at" value="Prochaine maintenance" />
                    <TextInput
                      id="equipement_next_maintenance_due_at"
                      type="date"
                      name="next_maintenance_due_at"
                      value={data.next_maintenance_due_at}
                      className="mt-1 block w-full"
                      onChange={(e) =>
                        setData("next_maintenance_due_at", e.target.value)
                      }
                    />
                    <InputError message={errors.next_maintenance_due_at} className="mt-2" />
                  </div>
                  <div>
                    <InputLabel htmlFor="equipement_next_calibration_due_at" value="Prochaine calibration" />
                    <TextInput
                      id="equipement_next_calibration_due_at"
                      type="date"
                      name="next_calibration_due_at"
                      value={data.next_calibration_due_at}
                      className="mt-1 block w-full"
                      onChange={(e) =>
                        setData("next_calibration_due_at", e.target.value)
                      }
                    />
                    <InputError message={errors.next_calibration_due_at} className="mt-2" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <InputLabel htmlFor="maintenance_interval_days" value="Frequence maintenance (jours)" />
                      <TextInput
                        id="maintenance_interval_days"
                        type="number"
                        min="1"
                        step="1"
                        name="maintenance_interval_days"
                        value={data.maintenance_interval_days}
                        className="mt-1 block w-full"
                        onChange={(e) =>
                          setData("maintenance_interval_days", e.target.value)
                        }
                      />
                      <InputError message={errors.maintenance_interval_days} className="mt-2" />
                    </div>
                    <div>
                      <InputLabel htmlFor="calibration_interval_days" value="Frequence calibration (jours)" />
                      <TextInput
                        id="calibration_interval_days"
                        type="number"
                        min="1"
                        step="1"
                        name="calibration_interval_days"
                        value={data.calibration_interval_days}
                        className="mt-1 block w-full"
                        onChange={(e) =>
                          setData("calibration_interval_days", e.target.value)
                        }
                      />
                      <InputError message={errors.calibration_interval_days} className="mt-2" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  href={route("equipement.index")}
                  className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                >
                  Annuler
                </Link>
                <button
                  type="submit"
                  disabled={processing}
                  className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600 disabled:opacity-60"
                >
                  Mettre a jour
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}