import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Create({ auth, managers }) {
  const { data, setData, post, errors } = useForm({
    image: "",
    name: "",
    status: "",
    description: "",
    start_date: "",
    due_date: "",
    client_name: "",
    client_address: "",
    client_phone: "",
    client_email: "",
    project_manager_id: "",
  });

  const onSubmit = (event) => {
    event.preventDefault();
    post(route("project.store"));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Créer un nouveau projet
          </h2>
        </div>
      }
    >
      <Head title="Projects" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg space-y-6"
            >
              <div>
                <InputLabel htmlFor="project_image_path" value="Image du projet" />
                <TextInput
                  id="project_image_path"
                  type="file"
                  name="image"
                  className="mt-1 block w-full"
                  onChange={(event) => setData("image", event.target.files[0])}
                />
                <InputError message={errors.image} className="mt-2" />
              </div>

              <div>
                <InputLabel htmlFor="project_name" value="Nom du projet" />
                <TextInput
                  id="project_name"
                  type="text"
                  name="name"
                  value={data.name}
                  className="mt-1 block w-full"
                  isFocused
                  onChange={(event) => setData("name", event.target.value)}
                />
                <InputError message={errors.name} className="mt-2" />
              </div>

              <div>
                <InputLabel htmlFor="project_description" value="Description du projet" />
                <TextAreaInput
                  id="project_description"
                  name="description"
                  value={data.description}
                  className="mt-1 block w-full"
                  onChange={(event) => setData("description", event.target.value)}
                />
                <InputError message={errors.description} className="mt-2" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <InputLabel htmlFor="project_start_date" value="Date de début du projet" />
                  <TextInput
                    id="project_start_date"
                    type="date"
                    name="start_date"
                    value={data.start_date}
                    className="mt-1 block w-full"
                    onChange={(event) => setData("start_date", event.target.value)}
                  />
                  <InputError message={errors.start_date} className="mt-2" />
                </div>
                <div>
                  <InputLabel htmlFor="project_due_date" value="Date d'échéance du projet" />
                  <TextInput
                    id="project_due_date"
                    type="date"
                    name="due_date"
                    value={data.due_date}
                    className="mt-1 block w-full"
                    onChange={(event) => setData("due_date", event.target.value)}
                  />
                  <InputError message={errors.due_date} className="mt-2" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <InputLabel htmlFor="client_name" value="Nom du client" />
                  <TextInput
                    id="client_name"
                    type="text"
                    name="client_name"
                    value={data.client_name}
                    className="mt-1 block w-full"
                    onChange={(event) => setData("client_name", event.target.value)}
                  />
                  <InputError message={errors.client_name} className="mt-2" />
                </div>
                <div>
                  <InputLabel htmlFor="client_email" value="Email du client" />
                  <TextInput
                    id="client_email"
                    type="email"
                    name="client_email"
                    value={data.client_email}
                    className="mt-1 block w-full"
                    onChange={(event) => setData("client_email", event.target.value)}
                  />
                  <InputError message={errors.client_email} className="mt-2" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <InputLabel htmlFor="client_address" value="Adresse du client" />
                  <TextInput
                    id="client_address"
                    type="text"
                    name="client_address"
                    value={data.client_address}
                    className="mt-1 block w-full"
                    onChange={(event) => setData("client_address", event.target.value)}
                  />
                  <InputError message={errors.client_address} className="mt-2" />
                </div>
                <div>
                  <InputLabel htmlFor="client_phone" value="Téléphone du client" />
                  <TextInput
                    id="client_phone"
                    type="text"
                    name="client_phone"
                    value={data.client_phone}
                    className="mt-1 block w-full"
                    onChange={(event) => setData("client_phone", event.target.value)}
                  />
                  <InputError message={errors.client_phone} className="mt-2" />
                </div>
              </div>

              <div>
                <InputLabel htmlFor="project_status" value="Statut du projet" />
                <SelectInput
                  name="status"
                  id="project_status"
                  value={data.status}
                  className="mt-1 block w-full"
                  onChange={(event) => setData("status", event.target.value)}
                >
                  <option value="">Sélectionner Statut</option>
                  <option value="pending">En attente</option>
                  <option value="in_progress">En cours</option>
                  <option value="completed">Terminé</option>
                </SelectInput>
                <InputError message={errors.status} className="mt-2" />
              </div>

              <div>
                <InputLabel htmlFor="project_manager_id" value="Utilisateur assigné (Chef de projet)" />
                <select
                  id="project_manager_id"
                  name="project_manager_id"
                  value={data.project_manager_id}
                  onChange={(event) => setData("project_manager_id", event.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">— None —</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name} ({manager.email})
                    </option>
                  ))}
                </select>
                <InputError message={errors.project_manager_id} className="mt-2" />
              </div>

              <div className="text-right">
                <Link
                  href={route("project.index")}
                  className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                >
                  Annuler
                </Link>
                <button className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
                  Soumettre
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
