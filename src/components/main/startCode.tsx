"use client";

import { Button } from "@nextui-org/react";
import Code from "./code";
import { useState } from "react";

const serverCode = `import { Scoopika, Agent } from "@scoopika/core";

const scoopika = new Scoopika();
const agent = new Agent("YOUR_AGENT_ID", scoopika);

(async () => {

  const { data, error } = await agent.run({
    inputs: {
      message: "Hello!",
      audio: [], // list of audio files
      images: [], // list of images
      urls: [] // list of websites URLs
    },
    hooks: {
      onToken: (t) => console.log(t) // real-time hook
    }
  });

  if (error === null) {
    console.log(data.content);
  } else {
    // handle errors
  }

})();
`;

const clientCode = `// Requires running a Scoopika endpoint (simple process takes 2 minutes, check the docs!)

import { Client, Agent } from "@scoopika/client";

const client = new Client("PATH_TO_YOUR_API");
const agent = new Agent("AGENT_ID", client);

(async () => {

    const { data, error } = await agent.run({
        inputs: {
            message: "Hello!",
            audio: [], // list of audio files
            images: [], // list of images
            urls: [] // list of websites URLs
        },
        hooks: {
            onToken: (t) => console.log(t) // real-time hook
        }
    })

    if (error === null) {
        console.log(data.content);
    } else {
        // handle errors
    }

})();
`;

const tabs: Record<string, string> = {
  "Server-side": serverCode,
  "Client-side": clientCode,
};

export default function StartCode() {
  const [open, setOpen] = useState<string>("Server-side");

  return (
    <div className="mt-5 w-full border-1 rounded-xl">
      <div className="flex items-center gap-3 bg-accent/50 rounded-t-xl border-b-1 p-2">
        {Object.keys(tabs).map((key, index) => (
          <Button onPress={() => setOpen(key)} key={`codetab-${index}`} size="sm" variant={open === key ? "bordered" : "light"}>
            {key}
          </Button>
        ))}
      </div>
      <Code
        code={tabs[open]}
        language="typescript"
        className="border-0 rounded-t-none"
      />
    </div>
  );
}
