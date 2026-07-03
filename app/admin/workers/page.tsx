"use client";

import { useState } from "react";
import Link from "next/link";
import { EmptyState, Pill, PrimaryButton, SecondaryButton, Section } from "@/components/ui";
import { useDataStore } from "@/lib/data-store";

export default function WorkersPage() {
  const { workers, createWorker, updateWorkerName, toggleWorker, loading } =
    useDataStore();
  const [name, setName] = useState("");
  const [editingWorkerId, setEditingWorkerId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;
    await createWorker(name.trim());
    setName("");
  }

  function startEditing(workerId: string, workerName: string) {
    setEditingWorkerId(workerId);
    setEditingName(workerName);
  }

  async function saveWorkerName(workerId: string) {
    if (!editingName.trim()) return;
    await updateWorkerName(workerId, editingName);
    setEditingWorkerId(null);
    setEditingName("");
  }

  function cancelEditing() {
    setEditingWorkerId(null);
    setEditingName("");
  }

  if (loading) {
    return <p className="text-sm text-[#756b66]">Cargando usuarios...</p>;
  }

  return (
    <>
      <Section
        title="Crear usuario de trabajo"
        description="Cada usuario recibe una clave unica que tambien forma su URL de acceso."
      >
        <form
          className="flex flex-col gap-3 rounded-lg border border-[#ffd7bd] bg-white p-4 shadow-sm sm:flex-row"
          onSubmit={submit}
        >
          <input
            className="min-w-0 flex-1 rounded-md border border-[#f3c27b] px-3 py-2 outline-none focus:border-[#fd5b00]"
            onChange={(event) => setName(event.target.value)}
            placeholder="Nombre del usuario"
            value={name}
          />
          <PrimaryButton type="submit">
            Crear usuario
          </PrimaryButton>
        </form>
      </Section>

      <Section title="Usuarios activos y claves">
        {workers.length ? (
          <div className="overflow-x-auto rounded-lg border border-[#ffd7bd] bg-white shadow-sm">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-[#fff4ea] text-[#7b2f00]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nombre</th>
                  <th className="px-4 py-3 font-semibold">Clave</th>
                  <th className="px-4 py-3 font-semibold">URL</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 font-semibold">Accion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ffe4d1]">
                {workers.map((worker) => (
                  <tr key={worker.id}>
                    <td className="px-4 py-3 font-medium">
                      {editingWorkerId === worker.id ? (
                        <input
                          autoFocus
                          className="w-full min-w-[180px] rounded-md border border-[#f3c27b] px-3 py-2 text-sm outline-none focus:border-[#fd5b00]"
                          onChange={(event) => setEditingName(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              void saveWorkerName(worker.id);
                            }
                            if (event.key === "Escape") {
                              cancelEditing();
                            }
                          }}
                          value={editingName}
                        />
                      ) : (
                        worker.name
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {worker.access_key}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        className="font-semibold text-[#c44700]"
                        href={`/trabajo/${worker.access_key}`}
                      >
                        /trabajo/{worker.access_key}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Pill tone={worker.is_active ? "brand" : "neutral"}>
                        {worker.is_active ? "Activo" : "Inactivo"}
                      </Pill>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {editingWorkerId === worker.id ? (
                          <>
                            <PrimaryButton
                              onClick={() => void saveWorkerName(worker.id)}
                              type="button"
                            >
                              Guardar
                            </PrimaryButton>
                            <SecondaryButton
                              onClick={cancelEditing}
                              type="button"
                            >
                              Cancelar
                            </SecondaryButton>
                          </>
                        ) : (
                          <SecondaryButton
                            onClick={() => startEditing(worker.id, worker.name)}
                            type="button"
                          >
                            Editar nombre
                          </SecondaryButton>
                        )}
                        <SecondaryButton
                          onClick={() => void toggleWorker(worker.id)}
                          type="button"
                        >
                          {worker.is_active ? "Desactivar" : "Activar"}
                        </SecondaryButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState message="Aun no hay usuarios de trabajo." />
        )}
      </Section>
    </>
  );
}
