"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import deleteApiKey from "@/functions/apikeys/delete";
import newApiKey from "@/functions/apikeys/new";
import engines from "@/scripts/agents/engines";
import tryRequest from "@/scripts/tryRequest";
import { Button, Tooltip } from "@nextui-org/react";
import {
  IconBraces,
  IconCheck,
  IconCode,
  IconEye,
  IconListTree,
  IconPlug,
  IconTool,
  IconTools,
} from "@tabler/icons-react";
import { useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { toast } from "sonner";
import ProviderLLMCode from "./code";
import Code from "../code";

interface Props {
  keys: { id: string; name: string }[];
  provider: { name: string; img: string };
}

const modelsProps = [
  {
    info: "JSON generation",
    key: "object",
    icon: <IconBraces size={18} />,
  },
  {
    info: "image inputs",
    key: "vision",
    icon: <IconEye size={18} />,
  },
  {
    info: "use tools",
    key: "tools",
    icon: <IconTools size={18} />,
  },
];

const connectCode = (
  provider: string
) => `import { Scoopika } from '@scoopika/scoopika';

const scoopika = new Scoopika();
scoopika.connectProvider('${provider}', 'YOUR_API_KEY');
`;

export default function ProviderItem({ keys, provider }: Props) {
  const [newProvider, setNewProvider] = useState<boolean>(false);
  const [newProviderKey, setNewProviderKey] = useState<string>("");
  const [newLoading, setNewLoading] = useState<boolean>(false);

  const [configureProvider, setConfigureProvider] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [listModel, setListModel] = useState<boolean>(false);
  const [code, setCode] = useState<boolean>(false);

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
      <div className="flex flex-col gap-3 p-3 border rounded-xl bg-accent/30 shadow relative overflow-hidden group">
        <div
          className={`text-xs p-1 pl-3 pr-3 flex items-center gap-2 bg-accent/20 rounded-bl-xl font-semibold border-l-1 border-b-1 absolute top-0 right-0 ${
            !isConnected && "opacity-0"
          }`}
        >
          <IconCheck size={16} />
          connected
        </div>
        <div className="w-full min-h-20 flex items-center justify-center relative pt-10">
          <img
            src={provider.img}
            className="min-w-12 max-w-12 min-h-12 max-h-12 object-cover rounded-full bg-white p-2 z-10 group-hover:rotate-[-20deg] transition-all"
          />
          <img
            src={provider.img}
            className="min-w-12 max-w-12 min-h-12 max-h-12 object-cover rounded-full mb-2 absolute z-0 blur-2xl opacity-40 group-hover:opacity-60 transition-all"
          />
        </div>
        <div className="w-full flex flex-col mt-6 pt-2 gap-1 border-t-1">
          <div className="w-full font-semibold">{provider.name}</div>
          <div className="w-full text-xs opacity-70 font-semibold">
            {engines[provider.name]?.models?.text?.length || 0} supported models
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {!isConnected ? (
            <>
              <Button
                size="sm"
                color="primary"
                className="font-semibold"
                startContent={<IconPlug size={19} />}
                onPress={() => setNewProvider(true)}
              >
                Connect
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="light"
                className="border font-semibold"
                startContent={<IconTool size={17} />}
                onPress={() => setConfigureProvider(true)}
              >
                Configure
              </Button>
            </>
          )}
          <div className="w-full flex items-center gap-3">
            <Button
              size="sm"
              variant="light"
              className="font-semibold w-full"
              startContent={<IconListTree size={19} />}
              onPress={() => setListModel(true)}
            >
              Models
            </Button>
            <Button
              size="sm"
              variant="light"
              className="font-semibold w-full"
              startContent={<IconCode size={19} />}
              onPress={() => setCode(true)}
            >
              Code
            </Button>
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
            Connect this provider to use it with AI agents with one line of
            code:
          </div>
          <Code language="typescript" code={connectCode(provider.name)} />
          <Button
            size="sm"
            variant="light"
            className="font-semibold w-full"
            startContent={<IconCode size={19} />}
            onPress={() => {
              setNewProvider(false);
              setCode(true);
            }}
          >
            See usage example
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

      <Dialog open={code} onOpenChange={setCode}>
        <DialogContent className="min-w-[70%]">
          <div className="mt-6">
            <ProviderLLMCode provider={provider.name} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={listModel} onOpenChange={setListModel}>
        <DialogContent>
          <div className="font-semibold">
            {provider.name}
            {"'s"} supported models
          </div>
          <div className="flex flex-col gap-2 opacity-80">
            {(engines[provider.name]?.models?.text || []).map(
              (model, index) => (
                <div
                  key={`llm-${provider.name}-${index}`}
                  className="w-full p-2 border-b-1 flex items-center text-sm"
                >
                  <div className="w-full">{model.name ?? model.id}</div>
                  <div className="flex items-center gap-2">
                    {modelsProps.map((prop, index) => (
                      <Tooltip
                        size="sm"
                        content={`${prop.info}: ${
                          (model as any)[prop.key]
                            ? "supported"
                            : "not supported"
                        }`}
                        key={`model-${model.name}-prop-${index}`}
                      >
                        <div
                          className={`${
                            (model as any)[prop.key]
                              ? "opacity-100"
                              : "opacity-50"
                          }`}
                        >
                          {prop.icon}
                        </div>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
          <div className="text-xs opacity-70 border p-3 mt-4 rounded-xl">
            All models can accept audio and url inputs, and output voice
            responses in real-time.
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
