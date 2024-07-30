"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import engines, { providers } from "@/scripts/agents/engines";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import Code from "../code";

const code = (
  provider: string,
  model: string,
  vision?: boolean
) => `import { Scoopika, Agent } from '@scoopika/scoopika';

// Initialize Scoopika with your token
const scoopika = new Scoopika(); // Ensure SCOOPIKA_TOKEN is set in the environment variables
scoopika.connectProvider('${provider}', 'YOUR_API_KEY'); // Connect ${provider} provider

// Create an agent with the desired configuration
const agent = new Agent(scoopika, {
    prompt: 'You are...', // Instructions for the model
    provider: '${provider}',
    model: '${model}'
});

// Run the agent with various input types (text generation)
const { data, error } = await agent.run({
    inputs: {
        message: 'Hello', // Text input
        images: [], // List of image URLs (requires vision LLMs)
        audio: [{ // List of audio files
            type: 'remote',
            path: 'URL' // URL of the audio file
        }],
        urls: [ // List of website URLs
            'https://scoopika.com/pricing'
        ]
    }
});

if (error !== null) {
    console.error('Error:', error);
} else {
    console.log('Data:', data);
}
`;

export default function ProviderLLMCode({ provider }: { provider: string }) {
  const models = engines[provider]?.models || { text: [] };
  const [model, setModel] = useState<string>(models.text[0].id);

  return (
    <>
      <div className="w-full flex items-center">
        <div className="w-full text-sm">Use {provider} with scoopika</div>
        <Select defaultValue={model} onValueChange={setModel}>
          <SelectTrigger>
            <SelectValue placeholder="Select LLM" />
          </SelectTrigger>
          <SelectContent>
            {models.text.map((model, index) => (
              <SelectItem
                key={`model-code-${provider}-${index}`}
                value={model.id}
              >
                {model.name || model.id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mt-6">
        <Code
          language="typescript"
          code={code(provider, model)}
          className="overflow-auto"
        />
      </div>
    </>
  );
}
