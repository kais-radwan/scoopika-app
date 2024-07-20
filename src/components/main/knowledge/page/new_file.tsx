"use client";

import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { addFileKnowledge } from "@/functions/knowledge/add";
import tryRequest from "@/scripts/tryRequest";
import { Button } from "@nextui-org/react";
import { KnowledgeStore } from "@prisma/client";
import { ChangeEvent, useState } from "react";
import { FaFile } from "react-icons/fa6";
import { MdAdd, MdRemove } from "react-icons/md";
import { LuFileStack } from "react-icons/lu";
import { toast } from "sonner";

interface Props {
  store: KnowledgeStore;
}

interface File {
  name: string;
  content: string;
}

export default function NewKnowledgeFile({ store }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles).map((file) => {
        const reader = new FileReader();
        return new Promise<File>((resolve) => {
          reader.onload = () => {
            const base64 = reader.result as string;
            resolve({ name: file.name, content: base64 });
          };
          reader.readAsDataURL(file);
        });
      });

      const resolvedFiles = await Promise.all(newFiles);
      setFiles((prev) => [...prev, ...resolvedFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addFiles = async () => {
    if (loading) return;

    if (files.length > 5) {
      return toast.error("You can only upload 5 files at once!");
    }

    setLoading(true);
    return tryRequest<boolean>({
      loading: `Adding files to knowledge store...`,
      success: `Added files to knowledge store!`,
      error: `Error. Please try again!`,
      func: async () => {
        const promises = files.map(async (file) => {
          const res = await addFileKnowledge(store.id, file.name, file.content);

          if (!res || !res.success) {
            throw new Error("Contact the support team or try again later!");
          }

          return res.success;
        });

        await Promise.all(promises);

        return true;
      },
      end: (s) => {
        setLoading(false);

        if (!s) return;

        setFiles([]);
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={!loading ? setOpen : () => {}}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="light"
          className="border"
          startContent={<MdAdd size={17} />}
          endContent={<FaFile />}
        >
          Add files
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center">
        <div className="text-center font-semibold mb-6">Add files</div>
        <input
          id="file-upload"
          className="hidden"
          type="file"
          multiple
          onChange={handleFileChange}
        />
        <label
          htmlFor="file-upload"
          className="w-full p-6 border-1 border-dashed rounded-lg flex flex-col items-center justify-center text-sm hover:border-black/20 dark:hover:border-white/20 bg-accent/20 transition-all cursor-pointer"
        >
          <LuFileStack size={40} className="opacity-80 mb-4" />
          <div className="text-sm">Upload files</div>
          <div className="text-xs opacity-70 text-center">
            Supported formats: PDF, TXT, MD (max file size: 1MB)
          </div>
        </label>
        {files.length > 0 && (
          <div className="flex flex-col w-full gap-2 mt-4">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b-1 pt-0.5 pb-0.5"
              >
                <span className="text-sm">{file.name}</span>
                <Button
                  size="sm"
                  className="ml-2"
                  variant="light"
                  onPress={() => handleRemoveFile(index)}
                  isIconOnly
                >
                  <MdRemove size={20} />
                </Button>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-3 w-full mt-4">
          <Button
            size="sm"
            className="w-full font-semibold"
            color="primary"
            isDisabled={files.length < 1}
            isLoading={loading}
            onPress={addFiles}
          >
            Save files
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
