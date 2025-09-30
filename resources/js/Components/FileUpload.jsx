// resources/js/Components/FileUpload.jsx

import { useForm } from "@inertiajs/react";
import InputLabel from "./InputLabel";
import PrimaryButton from "./PrimaryButton";
import InputError from "./InputError";

export default function FileUpload({ fileableId, fileableType }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    file: null,
    fileable_id: fileableId,
    fileable_type: fileableType,
  });

  const submit = (e) => {
    e.preventDefault();
    post(route("file.store"), {
      onSuccess: () => reset("file"),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <InputLabel htmlFor="file" value="Upload a File" />
        <input
          id="file"
          type="file"
          className="mt-1 block w-full"
          onChange={(e) => setData("file", e.target.files[0])}
        />
        <InputError message={errors.file} className="mt-2" />
      </div>

      <div className="flex items-center gap-4">
        <PrimaryButton disabled={processing}>Upload</PrimaryButton>
      </div>
    </form>
  );
}
