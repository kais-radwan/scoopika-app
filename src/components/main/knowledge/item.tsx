"use client";

import { Button } from "@nextui-org/react";
import { useState } from "react";
import { FaChevronRight, FaCode, FaDatabase } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import tryRequest from "@/scripts/tryRequest";
import deleteDataStore from "@/functions/datastores/delete";
import Code from "../code";
import ResourceLink from "../resourceLink";
import { KnowledgeStore } from "@prisma/client";
import Link from "next/link";
import { IoLibrary } from "react-icons/io5";
import { IconBooks } from "@tabler/icons-react";

interface Props {
  datastore: KnowledgeStore;
}

const code = (
  id: string
) => `import { Scoopika, Agent } from "@scoopika/scoopika";

const scoopika = new Scoopika({
    // Just add the store ID
    knowledge: "${id}"
});

// run agent with the session
const agent = new Agent("AGENT_ID", scoopika);
await agent.run({
    inputs: {
        message: "Hello!",
    }
});
`;

export default function KnowledgeStoreItem({ datastore }: Props) {
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const deleteNow = async () => {
    if (deleteLoading) return;

    setDeleteLoading(true);
    tryRequest<boolean>({
      loading: "Deleting history store",
      success: "Deleted history store",
      error: "Can't delete history store",
      func: async () => {
        const res = await deleteDataStore(datastore.id);

        if (!res || !res.success) {
          throw new Error("Try again later or contact support");
        }

        return res.success;
      },
      end: (s) => {
        setDeleteLoading(false);
        if (s) setDeleteOpen(false);
      },
    });
  };

  return (
    <Link href={`/knowledge/${datastore.id}`} className="w-full flex flex-col p-2 rounded-lg transition-all group relative hover:bg-black/10 dark:hover:bg-accent/30 transition-all border bg-accent/20 shadow">
      <div className="flex items-center gap-3">
        <div className="min-w-9 min-h-9 max-w-9 max-h-9 border rounded-md flex items-center justify-center bg-accent/30">
          <IconBooks className="opacity-70" size={18} />
        </div>
        <p className="text-sm min-w-max">{datastore.name}</p>
        <div className="w-full flex items-center justify-end pr-4">
          <FaChevronRight size={12} />
        </div>
      </div>
      <div className="w-full flex items-center gap-3">
        {/* <Dialog>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="flat"
              className="min-w-max font-semibold"
              startContent={<FaCode />}
            >
              Use in your app
            </Button>
          </DialogTrigger>
          <DialogContent className="">
            <div className="font-semibold">Use in your app</div>
            <ResourceLink
              name="Check docs for server-side and client-side usage"
              link="https://docs.scoopika.com/history-stores"
            />
            <Code language="typescript" code={code(datastore.id)} />
          </DialogContent>
        </Dialog> */}
      </div>

      {deleteOpen && (
        <Dialog
          open={deleteOpen}
          onOpenChange={!deleteLoading ? setDeleteOpen : () => {}}
        >
          <DialogContent>
            <div className="font-semibold">Delete history store</div>
            <div className="text-sm opacity-80">
              Are you sure you want to delete this history store? all sessions
              under it will be lost and can never be undone!
            </div>
            <div className="w-full flex flex-col lg:flex-row lg:items-center lg:justify-end gap-3">
              <Button
                size="sm"
                variant="flat"
                className="font-semibold"
                disabled={deleteLoading}
                onPress={() => {
                  if (!deleteLoading) setDeleteOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="flat"
                className="bg-red-500/10 border-1 border-red-500 font-semibold"
                isLoading={deleteLoading}
                onPress={() => deleteNow()}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Link>
  );
}
