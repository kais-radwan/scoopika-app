"use client";

import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { addWebsiteKnowledge } from "@/functions/knowledge/add";
import tryRequest from "@/scripts/tryRequest";
import isValidURL from "@/scripts/valid_url";
import { Button } from "@nextui-org/react";
import { KnowledgeStore } from "@prisma/client";
import { useState } from "react";
import { FaLink } from "react-icons/fa6";
import { MdAdd, MdRemove } from "react-icons/md";
import { toast } from "sonner";

interface Props {
  store: KnowledgeStore;
}

export default function NewKnowledgeUrl({ store }: Props) {
  const [urls, setUrls] = useState<string[]>([""]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const addUrls = async () => {
    if (loading) return;

    const invalidUrlIndex = urls.findIndex((url) => !isValidURL(url));
    if (invalidUrlIndex !== -1) {
      return toast.error(`Invalid URL at position ${invalidUrlIndex + 1}`);
    }

    setLoading(true);
    return tryRequest<boolean>({
      loading: `Adding websites to knowledge store...`,
      success: `Added websites to knowledge store!`,
      error: `Error. Please try again!`,
      func: async () => {
        const promises = urls.map(async (url) => {
          const res = await addWebsiteKnowledge(store.id, url);

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

        setUrls([""]);
        setOpen(false);
      },
    });
  };

  const addNewUrlField = () => {
    if (urls.length === 3) {
      return toast.error("You can only add 3 websites at once!");
    }

    setUrls([...urls, ""]);
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const removeUrlField = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls.length > 0 ? newUrls : [""]);
  };

  return (
    <Dialog open={open} onOpenChange={!loading ? setOpen : () => {}}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="light"
          className="border"
          startContent={<MdAdd size={17} />}
          endContent={<FaLink />}
        >
          Add websites (urls)
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center">
        <div className="text-center font-semibold mb-6">Add websites</div>
        <div className="flex flex-col w-full gap-2">
          {urls.map((url, index) => (
            <div key={index} className="w-full flex items-center gap-2">
              <div className="text-xs opacity-70">#{index + 1}</div>
              <Input
                value={url}
                onInput={(e) => updateUrl(index, e.currentTarget.value)}
                placeholder="Enter website url..."
              />
              <Button
                size="sm"
                className="ml-2"
                variant="light"
                onPress={() => removeUrlField(index)}
                isIconOnly
              >
                <MdRemove size={20} />
              </Button>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 w-full">
          <Button
            size="sm"
            className="w-full mt-4 font-semibold border"
            variant="light"
            onPress={addNewUrlField}
          >
            Add another URL
          </Button>
          <Button
            size="sm"
            className="w-full font-semibold"
            color="primary"
            isDisabled={urls.some((url) => url.length < 1)}
            isLoading={loading}
            onPress={addUrls}
          >
            Save websites
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
