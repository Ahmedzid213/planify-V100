// resources/js/Pages/Equipement/Create.jsx
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Create({ auth }) {
  const { data, setData, post, errors, reset } = useForm({
    name: "",
    brand: "",
    reference: "",
    serial_number: "",
    note: "",
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("equipement.store"));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            créer un nouvel équipement
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
                <InputLabel
                  htmlFor="Nom de l'équipement"
                  value="Nom de l'équipement"
                />
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
                  htmlFor="marque de l'équipement"
                  value="Marque de l'équipement"
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
                  htmlFor="Référence de l'équipement"
                  value="Référence de l'équipement"
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
                  htmlFor="Numéro de Série de l'Équipement"
                  value="Numéro de Série de l'Équipement"
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
                <InputLabel
                  htmlFor="remarque sur l'Équipement"
                  value="remarque sur l'Équipement"
                />
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
