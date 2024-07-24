"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import deleteApiKey from "@/functions/apikeys/delete";
import newApiKey from "@/functions/apikeys/new";
import tryRequest from "@/scripts/tryRequest";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { toast } from "sonner";

interface Props {
  keys: { id: string; name: string }[];
  provider: { name: string; img: string };
}

export default function ProviderItem({ keys, provider }: Props) {
  const [newProvider, setNewProvider] = useState<boolean>(false);
  const [newProviderKey, setNewProviderKey] = useState<string>("");
  const [newLoading, setNewLoading] = useState<boolean>(false);

  const [configureProvider, setConfigureProvider] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const isConnected = keys.map((k) => k.name).indexOf(provider.name) !== -1;

  const connectProvider = async () => {
    if (newProviderKey.length < 7) {
      return toast.error("Invalid API Key", {
        description: "Please enter a valid API key in order to use Scoopika",
      });
    }

    setNewLoading(true);
    tryRequest<{ success: true; id: string }>({
      loading: "Connecting provider...",
      success: "Connected LLM provider successfully",
      error: "Can't connect provider",
      func: async () => {
        const res = await newApiKey(provider.name, newProviderKey);
        if (!res || !res.success) {
          throw new Error("Error adding API key!");
        }

        return res;
      },
      end: (s) => {
        setNewLoading(false);
        if (!s) return;

        setNewProvider(false);
        setNewProviderKey("");
      },
    });
  };

  const diconnectProvider = async () => {
    setDeleteLoading(true);
    tryRequest<boolean>({
      loading: "Deleting API key...",
      success: "Deleted API key successfully",
      error: "Can't delete API key",
      func: async () => {
        const id = keys.filter((k) => k.name === provider.name)[0]?.id;

        if (!id) {
          throw new Error("Provider is not connected!");
        }

        const res = await deleteApiKey(id);
        if (!res || !res.success) {
          throw new Error("Can't delete API key right now! contact support");
        }

        return res.success;
      },
      end: (s) => {
        setDeleteLoading(false);
        if (!s) return;

        setConfigureProvider(false);
      },
    });
  };

  return (
    <>
      <div
        className="p-5 pt-7 pb-7 border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-accent/20 hover:border-black/20 dark:hover:border-white/20 transition-all hover:shadow"
        onClick={() => {
          if (!isConnected) {
            setNewProvider(true);
          } else {
            setConfigureProvider(true);
          }
        }}
      >
        <div
          className={`text-xs p-1 pl-3 pr-3 bg-accent/20 rounded-full mb-5 border ${
            !isConnected && "opacity-0"
          }`}
        >
          connected
        </div>
        <img
          src={provider.img}
          className="min-w-12 max-w-12 min-h-12 max-h-12 object-cover rounded-full mb-2"
        />
        <div className="w-full text-center">{provider.name}</div>
        <div className="h-full mt-8 flex items-end">
          <div className="flex items-center gap-2 text-sm opacity-70">
            {!isConnected ? "Connect provider" : "Configure"}
            <FaChevronRight size={11} />
          </div>
        </div>
      </div>

      <Dialog
        open={newProvider}
        onOpenChange={!newLoading ? setNewProvider : () => {}}
      >
        <DialogContent>
          <div className="font-semibold">Connect {provider.name}</div>
          <div className="text-sm opacity-80">
            Just enter your <b>{provider.name}</b> API key and {"you're"} good
            to go. all API keys are encrypted!
          </div>
          <Input
            placeholder={`Your ${provider.name} API key...`}
            value={newProviderKey}
            onInput={(e) => {
              setNewProviderKey(e.currentTarget.value);
            }}
            type="password"
            className="mt-4"
          />
          <Button
            size="sm"
            className="w-full font-semibold"
            color="primary"
            endContent={<FaChevronRight />}
            isLoading={newLoading}
            onPress={connectProvider}
          >
            Connect provider
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog
        open={configureProvider}
        onOpenChange={!deleteLoading ? setConfigureProvider : () => {}}
      >
        <DialogContent>
          <div className="font-semibold">Configure {provider.name}</div>
          <div className="text-sm opacity-80">
            Currently you {"can't"} change the API key for this provider
            directly, instead you need to disconnect it and then connect it
            again using another API key, it {"shouldn't"} take more than 10
            seconds!
          </div>
          <Button
            size="sm"
            className="w-full font-semibold border border-red-500"
            variant="light"
            endContent={<FaChevronRight />}
            isLoading={deleteLoading}
            onPress={diconnectProvider}
          >
            Disconnect provider
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
