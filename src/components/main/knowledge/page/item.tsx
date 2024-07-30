"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import deleteKnowledgeSource from "@/functions/knowledge/delete";
import tryRequest from "@/scripts/tryRequest";
import isValidURL from "@/scripts/valid_url";
import { Button } from "@nextui-org/react";
import { KnowledgeSource } from "@prisma/client";
import { IconBackspace, IconFileText, IconFileTypePdf, IconSquareRoundedMinusFilled, IconTrashX, IconWorld } from "@tabler/icons-react";
import { useState } from "react";
import { FaDeleteLeft, FaFile, FaFilePdf, FaGlobe } from "react-icons/fa6";

interface Props {
  source: KnowledgeSource;
}

const Icon = ({ name }: { name: string }) => {
  if (isValidURL(name)) {
    return <IconWorld size={20} className="opacity-80" />;
  }

  if (name.endsWith(".pdf")) {
    return <IconFileTypePdf size={20} className="opacity-80" />;
  }

  return <IconFileText size={20} className="opacity-80" />;
};

export default function KnowledgeSourceItem({ source }: Props) {
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const deleteSource = async () => {
    if (deleteLoading || !deleteOpen) return;

    setDeleteLoading(true);
    tryRequest<boolean>({
      loading: "Deleting knowledge source...",
      success: "Delted knowledge source!",
      error: "Can't delete knowledge source",
      func: async () => {
        const res = await deleteKnowledgeSource(
          source.storeId,
          source.id,
          JSON.parse(source.vectors)
        );
        if (!res.success) {
          throw new Error("Please contact support!");
        }

        return res.success;
      },
      end: (s) => {
        setDeleteLoading(false);
        if (!s) return;

        setDeleteOpen(false);
      },
    });
  };

  return (
    <div className="p-3 pl-4 pr-4 border-1 rounded-md bg-accent/10 relative flex items-center gap-3 group">
      <div className="w-full flex items-center gap-3">
        <div className="min-w-8 max-w-8 min-h-8 max-h-8 bg-accent/30 rounded-xl flex items-center justify-center border">
          <Icon name={source.name} />
        </div>
        <div className="text-sm opacity-80">{source.name}</div>
      </div>
      <div className="min-w-max opacity-0 group-hover:opacity-100 transition-all">
        <Button
          size="sm"
          variant="light"
          className=""
          isIconOnly
          startContent={<IconTrashX size={18} />}
          onPress={() => setDeleteOpen(true)}
        />
      </div>

      {deleteOpen && (
        <Dialog
          open={deleteOpen === true}
          onOpenChange={
            !deleteLoading ? (s) => setDeleteOpen(s) : () => {}
          }
        >
          <DialogContent>
            <div className="text-xs opacity-70 w-36 truncate">
              {source.name}
            </div>
            <div className="font-semibold">Remove knowledge source</div>
            <div className="text-sm opacity-80">
              Are you sure you want to remove this source from your knowledge store? you can add it later if you need!
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-end">
              <Button
                size="sm"
                variant="flat"
                className="bg-red-500/5 border border-red-500"
                isLoading={deleteLoading}
                onPress={() => deleteSource()}
              >
                Remove knowledge source
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
