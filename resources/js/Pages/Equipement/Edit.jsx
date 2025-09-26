// resources/js/Pages/Equipement/Edit.jsx
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Edit({ auth, equipement }) {
  const { data, setData, post, errors, reset } = useForm({
    name: equipement.data.name || "",
    brand: equipement.data.brand || "",
    reference: equipement.data.reference || "",
    serial_number: equipement.data.serial_number || "",
    note: equipement.data.note || "",
    _method: "PUT",
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("equipement.update", equipement.data.id));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Modifier l'équipement "{equipement.data.name}"
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
              className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
            >
              <div className="mt-4">
                <InputLabel htmlFor="equipement_name" value="Equipement Name" />
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
              <div className="mt-4">
                <InputLabel
                  htmlFor="equipement_brand"
                  value="Equipement Brand"
                />
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
              <div className="mt-4">
                <InputLabel
                  htmlFor="equipement_reference"
                  value="Equipement Reference"
                />
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
              <div className="mt-4">
                <InputLabel
                  htmlFor="equipement_serial_number"
                  value="Equipement Serial Number"
                />
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
              <div className="mt-4">
                <InputLabel htmlFor="equipement_note" value="Equipement Note" />
                <TextAreaInput
                  id="equipement_note"
                  name="note"
                  value={data.note}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("note", e.target.value)}
                />
                <InputError message={errors.note} className="mt-2" />
              </div>
              <div className="mt-4 text-right">
                <Link
                  href={route("equipement.index")}
                  className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                >
                  Cancel
                </Link>
                <button className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
