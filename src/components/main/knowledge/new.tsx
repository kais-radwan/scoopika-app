"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import createKnowledgeStore from "@/functions/knowledge/create";
import tryRequest from "@/scripts/tryRequest";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { FaChevronRight, FaPlus } from "react-icons/fa6";
import { toast } from "sonner";

export default function NewKnowledgeStore() {
  const [name, setName] = useState<string | undefined>();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const create = async () => {
    if (loading) return;

    if (!name || name.length < 3) {
      return toast.error("Enter valid name!", {
        description: "History store name should be at least 3 characters",
      });
    }

    setLoading(true);
    tryRequest({
      loading: "Creating knowledge store...",
      success: "Created knowledge store!",
      error: "Can't create knowledge store",
      func: async () => {
        const res = await createKnowledgeStore(name);

        if (res?.success === false) {
          throw new Error("Please try again later or contact support");
        }
      },
      end: () => {
        setLoading(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={!loading ? setOpen : () => {}}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="bordered"
          className=""
          startContent={<FaPlus />}
        >
          New knowledge store
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="font-semibold">New knowledge store</div>
        <Input
          placeholder="Enter knowledge store name (e.g. dev)"
          defaultValue={name}
          onInput={(e) => {
            const value = e?.currentTarget?.value;
            setName(value);
          }}
        />
        <Button
          size="sm"
          color="primary"
          className="font-semibold"
          endContent={<FaChevronRight />}
          isLoading={loading}
          onPress={() => create()}
        >
          Create knowledge store
        </Button>
      </DialogContent>
    </Dialog>
  );
}
