"use client";

import { Button } from "@nextui-org/react";
import { KnowledgeSource, KnowledgeStore } from "@prisma/client";
import { FaChevronRight, FaFile } from "react-icons/fa6";
import { IoLibrary } from "react-icons/io5";
import {
  MdAdd,
  MdCode,
  MdContentCopy,
  MdDataset,
  MdDelete,
  MdSettings,
} from "react-icons/md";
import Empty from "../../empty";
import NewKnowledgeUrl from "./new_url";
import KnowledgeSourceItem from "./item";
import NewKnowledgeFile from "./new_file";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";
import tryRequest from "@/scripts/tryRequest";
import { deleteKnowledgeStore } from "@/functions/agents/knowledge/delete";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ResourceLink from "../../resourceLink";
import Code from "../../code";
import { Input } from "@/components/ui/input";
import {
  IconBooks,
  IconLibrary,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";

interface Props {
  store: KnowledgeStore;
  plan: string;
  sources: KnowledgeSource[];
}

const code = (
  id: string
) => `import { Scoopika, Agent } from "@scoopika/scoopika";

const scoopika = new Scoopika({
    // Just add the store ID
    knowledge: "${id}"
});
`;

export default function KnowledgePage({ store, sources }: Props) {
  const [dropOpen, setDropOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [codeOpen, setCodeOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const deleteStore = async () => {
    if (deleteLoading) return;

    setDeleteLoading(true);
    tryRequest({
      loading: "Deleting knowledge store",
      success: "Deleted knowledge store!",
      error: "Can't delete knowledge store",
      func: async () => {
        const res = await deleteKnowledgeStore(store.id);
        if (res?.success === false) {
          throw new Error("Contact support or try again later!");
        }
      },
      end: () => {
        setDeleteLoading(false);
      },
    });
  };

  return (
    <>
      <div>
        <div className="w-full p-3 pl-4 pr-4 bg-accent/30 border-b-1 flex items-center gap-3">
          <div className="text-sm font-semibold opacity-70 w-full truncate flex items-center gap-2">
            <IconBooks size={20} />
            <FaChevronRight size={11} />
            {store.name}
          </div>
          <div className="min-w-max flex items-cetner gap-3">
            <NewKnowledgeUrl store={store} />
            <NewKnowledgeFile store={store} />
            <DropdownMenu open={dropOpen} onOpenChange={setDropOpen}>
              <DropdownMenuTrigger>
                <Button
                  size="sm"
                  isIconOnly
                  variant="light"
                  className="border"
                  startContent={<IconSettings size={18} />}
                  onPress={() => setDropOpen((prev) => !prev)}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(store.id);
                    toast.success("Copied knowledge store ID!");
                  }}
                >
                  <div className="flex items-center gap-2 text-sm">
                    <MdContentCopy />
                    Copy ID
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCodeOpen(true)}>
                  <div className="flex items-center gap-2 text-sm">
                    <MdCode />
                    Code
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
                  <div className="flex items-center gap-2 text-sm text-red-500">
                    <MdDelete />
                    Delete store
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full p-3 pl-4 pr-4 border-b-1 bg-accent/10">
          <IconSearch size={18} className="opacity-80" />
          <input
            value={search}
            onInput={(e) => {
              setSearch(e.currentTarget.value);
            }}
            placeholder="Filter by name..."
            className="bg-transparent rounded-none border-0 focus:border-border focus:border-b-foreground text-sm"
          />
        </div>
      </div>
      <div className="w-full p-6 pt-0">
        {sources.length < 1 && (
          <Empty
            icon={<MdDataset />}
            title="Add data to this knowledge store"
            description="Add the first data source to this knowledge store, you can upload files (pdf and text) or websites urls"
          />
        )}

        {sources.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 flex gap-4 mb-10">
              {sources
                .filter(
                  (s) =>
                    s.name.toLowerCase().includes(search.toLowerCase()) ||
                    search.toLowerCase().includes(s.name.toLowerCase())
                )
                .map((source, index) => (
                  <KnowledgeSourceItem
                    key={`source-${index}`}
                    source={source}
                  />
                ))}
            </div>
          </>
        )}

        <div className="w-full p-3 border rounded-xl bg-accent/20 mt-4">
          <div className="text-xs p-0.5 pl-2 pr-2 border rounded-full bg-accent/30 max-w-max">
            New
          </div>
          <div className="text-sm font-semibold mt-3">
            Websites data is auto updated
          </div>
          <div className="text-sm opacity-80 mt-1">
            Websites data is automatically updated weekly so your AI agents
            knowledge stays up to date all the time!
          </div>
        </div>
      </div>

      <Dialog open={codeOpen} onOpenChange={setCodeOpen}>
        <DialogContent className="">
          <div className="font-semibold">Use in your app</div>
          <Code language="typescript" code={code(store.id)} />
        </DialogContent>
      </Dialog>

      {deleteOpen && (
        <Dialog
          open={deleteOpen === true}
          onOpenChange={!deleteLoading ? (s) => setDeleteOpen(s) : () => {}}
        >
          <DialogContent>
            <div className="font-semibold">Delete knowledge store</div>
            <div className="text-sm opacity-80">
              Are you sure you want to delete this knowledge store? this action{" "}
              {"can't"} be undone and all data will be lost forever!
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-end">
              <Button
                size="sm"
                variant="flat"
                className="bg-red-500/5 border border-red-500"
                isLoading={deleteLoading}
                onPress={() => deleteStore()}
              >
                Delete knowledge store
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
