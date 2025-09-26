// resources/js/Pages/EquipementAssignment/Index.jsx
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";

export default function Index({
  auth,
  freeEquipements,
  inUseEquipements,
  users,
}) {
  const { data, setData, post, errors } = useForm({
    equipement_id: "",
    user_id: "",
  });

  const { post: unassignPost } = useForm();

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("equipement.assignment.assign"));
  };

  const unassignEquipement = (equipementId) => {
    if (confirm("Are you sure you want to unassign this equipment?")) {
      unassignPost(route("equipement.assignment.unassign", equipementId), {
        preserveScroll: true,
      });
    }
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Assignement d'équipement
        </h2>
      }
    >
      <Head title="Assignement d'équipement" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <form onSubmit={onSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Équipement Libre
                    </h3>
                    <select
                      name="equipement_id"
                      id="equipement_id"
                      className="mt-1 block w-full dark:bg-gray-900 dark:text-gray-300"
                      onChange={(e) => setData("equipement_id", e.target.value)}
                    >
                      <option value="">Sélectionner Équipement</option>
                      {Object.values(freeEquipements).map((equipement) => (
                        <option key={equipement.id} value={equipement.id}>
                          {equipement.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Utilisateurs
                    </h3>
                    <select
                      name="user_id"
                      id="user_id"
                      className="mt-1 block w-full dark:bg-gray-900 dark:text-gray-300"
                      onChange={(e) => setData("user_id", e.target.value)}
                    >
                      <option value="">Sélectionner Utilisateur</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="submit"
                    className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"
                  >
                    Assigner Équipement
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mt-4">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Équipement en Utilisation
              </h3>
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-4">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                  <tr>
                    <th className="px-3 py-3">Équipement</th>
                    <th className="px-3 py-3">Assigné à</th>
                    <th className="px-3 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(inUseEquipements).map((equipement) => (
                    <tr key={equipement.id}>
                      <td className="px-3 py-2">{equipement.name}</td>
                      <td className="px-3 py-2">
                        {
                          users.find((user) => user.id === equipement.user_id)
                            ?.name
                        }
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => unassignEquipement(equipement.id)}
                          className="font-medium text-red-600 dark:text-red-500 hover:underline"
                        >
                          Désassigner
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
    </AuthenticatedLayout>
  );
}
