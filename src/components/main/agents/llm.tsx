"use client";

import engines, {
  defaultOptions,
  getDefaultOptions,
  getEngines,
  providers,
  providersWithImg,
} from "@/scripts/agents/engines";
import { AgentData } from "@scoopika/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@nextui-org/react";
import listKeys from "@/functions/apikeys/list";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface Props {
  agent: AgentData;
  updateAgent: Dispatch<SetStateAction<AgentData>>;
}

export default function AgentLLM({ agent, updateAgent }: Props) {
  const [keys, setKeys] = useState<string[]>([]);
  const [provider, setProvider] = useState<string>(agent.prompts[0].llm_client);
  const usedProvider = providersWithImg.filter((p) => p.name === provider)[0];
  const [providerDrop, setProviderDrop] = useState<boolean>(false);
  const [modelDrop, setModelDrop] = useState<boolean>(false);

  const getKeys = async () => {
    const keys = await listKeys();
    if (!keys.success) {
      return toast.error("Can't load connected providers!", {
        description: "Please report this issue to the support team",
      });
    }

    setKeys(keys.keys.map((k) => k.name));
  };

  useEffect(() => {
    getKeys();
  }, []);

  const changeProvider = (value: string) => {
    setProvider(value);
    updateAgent((prev) => ({
      ...prev,
      prompts: [
        {
          ...prev.prompts[0],
          llm_client: value,
        },
      ],
    }));
  };

  const changeModel = (value: string) => {
    updateAgent((prev) => ({
      ...prev,
      prompts: [
        {
          ...prev.prompts[0],
          model: value,
          options: getDefaultOptions(
            (
              getEngines("text")?.[prev.prompts[0].llm_client]?.models[
                "text"
              ] || []
            ).filter((m) => m?.id === value)[0]?.options || defaultOptions
          ),
        },
      ],
    }));
  };

  if (!usedProvider) {
    return <>Unknown provider error</>;
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild className="w-full">
          <Button
            size="sm"
            variant="light"
            className="border w-full"
            startContent={
              <img
                src={usedProvider.img}
                className="min-w-5 max-w-5 min-h-5 max-h-5 rounded-full"
              />
            }
          >
            {provider} {"-> "} {agent.prompts[0].model}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <div className="font-semibold">Select LLM</div>

          {keys.length < 1 && (
            <div className="w-full p-4 border border-dashed rounded-xl border-black/20 dark:border-white/20">
              <div className="text-sm font-semibold">
                You have no connected providers
              </div>
              <div className="text-xs opacity-80">
                Please connect your LLM providers in order to create and run AI
                agents!
              </div>
            </div>
          )}

          <DropdownMenu open={providerDrop} onOpenChange={setProviderDrop}>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="light"
                className="border w-full"
                onPress={() => setProviderDrop(true)}
                startContent={
                  <img
                    src={usedProvider.img}
                    className="min-w-5 max-w-5 min-h-5 max-h-5 rounded-full"
                  />
                }
              >
                {provider}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {providersWithImg.map((p, index) => (
                <DropdownMenuItem
                  key={`select-provider-item-${index}`}
                  className="flex items-center gap-3"
                  onClick={() => changeProvider(p.name)}
                >
                  <img
                    src={p.img}
                    className="min-w-5 max-w-5 min-h-5 max-h-5 rounded-full"
                  />
                  <div className="w-full">{p.name}</div>
                  {keys.indexOf(p.name) !== -1 && (
                    <div className="p-0.5 pl-2 pr-2 text-xs border bg-accent/30 rounded-full opacity-70 min-w-max">
                      connected
                    </div>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu open={modelDrop} onOpenChange={setModelDrop}>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="light"
                className="border w-full"
                onPress={() => setModelDrop(true)}
              >
                {agent.prompts[0].model}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {(engines?.[provider]?.models?.["text"] || []).map((model, index) => (
                <DropdownMenuItem
                  key={`select-model-item-${index}`}
                  className="flex items-center gap-3"
                  onClick={() => changeModel(model.id)}
                >
                  <div className="w-full">{model.name || model.id}</div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </DialogContent>
      </Dialog>
    </>
  );
}
