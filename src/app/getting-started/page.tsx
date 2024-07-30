import Code from "@/components/main/code";
import AppHead from "@/components/main/head";
import frameworks from "@/scripts/framworks";
import { Button } from "@nextui-org/react";
import {
  IconBook,
  IconClock2,
  IconExternalLink,
  IconPlug,
} from "@tabler/icons-react";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { FaChevronRight } from "react-icons/fa6";

export const metadata: Metadata = {
  title: "Getting Started",
};

const Step = ({
  title,
  description,
  tag,
  right,
  time,
}: {
  title: string;
  description: React.ReactNode;
  tag: string;
  right?: React.ReactNode;
  time: string;
}) => {
  return (
    <div className="w-full p-6 flex gap-10 border-b-1">
      <div className="w-full">
        <div className="flex items-center gap-3">
          <div className="max-w-max p-1 pl-2 pr-2 text-xs border rounded-full bg-accent/20 mb-2 flex items-center gap-2">
            {tag}
          </div>
          <div className="max-w-max p-1 pl-2 pr-2 text-xs border rounded-full bg-accent/20 mb-2 flex items-center gap-2">
            <IconClock2 size={18} />
            {time}
          </div>
        </div>
        <div className="font-semibold mb-2">{title}</div>
        <div className="text-sm opacity-80">{description}</div>
      </div>
      <div className="w-full flex flex-col gap-3 items-end">
        {right && right}
      </div>
    </div>
  );
};

const initCode = `import { Scoopika } from '@scoopika/scoopika';

const scoopika = new Scoopika();`;

const createAgentCode = `import { Agent } from '@scoopika/scoopika';

const agent = new Agent(scoopika, {
    provider: 'openai',
    model: 'gpt-4',
    prompt: 'Your role is to...' // the agent instructions
});
`;

const runAgentCode = `const { data, error } = await agent.run({
  // at least one of the inputs is required
  inputs: {
    message: "Hello!", // text inputs
    audios: [
      // list of audio files
      { type: 'remote', path: 'URL' }
    ],
    images: [],
    urls: [{
      // list of website URLs
      'scoopika.com'
    }]
  }
});

if (error === null) {
  console.log(data);
} else {
  // handle errors
}
`;

const storeCode = `const agent = new Agent(scoopika, {
  ...,
  memory: 'MEMORY_STORE_ID'
});`;

const knowledgeCode = `const agent = new Agent(scoopika, {
  ...,
  knowledge: 'KNOWLEDGE_STORE_ID'
});`;

export default function Page() {
  return (
    <>
      <AppHead
        title="Getting Started"
        description="Simple steps to start using Scoopika in your app"
        action={
          <Button
            size="sm"
            color="primary"
            className="font-semibold"
            startContent={<IconBook size={18} />}
            as={Link}
            href="https://docs.scoopika.com"
            target="_blank"
          >
            Full documentation
          </Button>
        }
      />
      <div className="p-6 pt-0">
        <Step
          title="Start with a Framework"
          description={
            <div className="flex flex-col gap-4">
              <div>
                Scoopika works out of the box with any JS framework, only the AI
                agent deployment step changes slightly between some frameworks.
              </div>
              <div>The steps below work with any web framework!</div>
            </div>
          }
          tag="docs"
          time="1-4 minutes"
          right={
            <div className="grid grid-cols lg:grid-cols-2 flex gap-4 w-[90%]">
              {frameworks.map((framework, index) => (
                <Link
                  href={framework.link}
                  target="_blank"
                  key={`framework-${index}`}
                  className="p-2 border rounded-xl flex items-center gap-2 bg-accent/10 hover:border-black/20 dark:hover:border-white/20"
                >
                  <div className="w-10 h-10 flex items-center justify-center p-1 bg-accent/10 rounded-xl">
                    {framework.icon}
                  </div>
                  <div className="text-sm font-semibold">{framework.name}</div>
                </Link>
              ))}
            </div>
          }
        />

        <Step
          title="0. Install Scoopika SDK"
          description="Install Scoopika's main SDK, which is built to be used on the
              server-side, that means in your Nodejs API, Nextjs server actions
              or API routes."
          tag="installation"
          time="5 seconds"
          right={
            <Code
              className="min-w-[90%] max-w-[90%]"
              language="bash"
              code="npm i @scoopika/scoopika"
            />
          }
        />
        <Step
          title="1. Initialize Scoopika"
          description={
            <>
              <div>
                Now initialize Scoopika in your app, first generate an access
                token by clicking on the settings icons in the top-left corner,
                add to your environment variables as <b>SCOOPIKA_TOKEN</b>
              </div>
            </>
          }
          tag="initialization"
          time="5 seconds"
          right={
            <>
              <Code
                className="min-w-[90%] max-w-[90%]"
                language="plaintext"
                code={`SCOOPIKA_TOKEN="YOUR_TOKEN"`}
              />
              <Code
                className="min-w-[90%] max-w-[90%]"
                language="typescript"
                code={initCode}
              />
            </>
          }
        />
        <Step
          title="2. Connect provider"
          description={
            <div className="flex flex-col gap-4">
              <div>
                Connect your preferred LLM provider to you with your AI agents,
                you can check the {"'LLM providers'"} page to see supported
                providers and code examples
              </div>
              <Button
                size="sm"
                variant="light"
                className="font-semibold border"
                startContent={<IconPlug size={18} />}
                as={Link}
                href="/llm-providers"
              >
                Connect providers
              </Button>
            </div>
          }
          tag="server-side usage"
          time="5 seconds"
          right={
            <Code
              className="min-w-[90%] max-w-[90%]"
              language="typescript"
              code={`scoopika.connectProvider('openai', 'you-api-key');`}
            />
          }
        />

        <Step
          title="3. Create AI agent"
          description="Now you can create an AI agent that uses the LLM provider you just connected, this is just an example that uses OpenAI"
          tag="server-side usage"
          time="relative"
          right={
            <>
              <Code
                className="min-w-[90%] max-w-[90%]"
                language="typescript"
                code={createAgentCode}
              />
            </>
          }
        />

        <Step
          title="4. Run AI Agent"
          description={
            <div className="flex flex-col gap-4">
              <div>
                Now try running the AI agent, you can send it inputs in multiple
                forms, as text, audio files, and websites URLs.
              </div>
              <div>
                This example shows text generation, see the full docs for other
                use cases like JSON data generation.
              </div>
              <Button
                size="sm"
                variant="light"
                className="border font-semibold"
                endContent={<IconExternalLink size={18} />}
                as={Link}
                href="https://docs.scoopika.com/agents"
                target="_blank"
              >
                Usage documentation
              </Button>
            </div>
          }
          tag="server-side usage"
          time="10 seconds"
          right={
            <>
              <Code
                className="min-w-[90%] max-w-[90%]"
                language="typescript"
                code={runAgentCode}
              />
            </>
          }
        />

        <Step
          title="5. Deploy AI agent"
          description={
            <div className="flex flex-col gap-4">
              <div>
                If you want to serve your AI agent as an API endpoint... why? so
                you can use easily use it on the client-side using our client
                library
              </div>
              <div>
                This step is strongly recommended for web applications, it will
                give you a simple way to use your agents on the client-side with
                real-time streaming for text & voices responses.
              </div>
              <div>
                Select your web framework to see a simple step-by-step guide
                built just for you!
              </div>
            </div>
          }
          tag="deployment"
          time="2 minutes"
          right={
            <div className="grid grid-cols lg:grid-cols-2 flex gap-4 w-[90%]">
              {frameworks.map((framework, index) => (
                <Link
                  href={framework.link}
                  target="_blank"
                  key={`framework-${index}`}
                  className="p-2 border rounded-xl flex items-center gap-2 bg-accent/10 hover:border-black/20 dark:hover:border-white/20"
                >
                  <div className="w-10 h-10 flex items-center justify-center p-1 bg-accent/10 rounded-xl">
                    {framework.icon}
                  </div>
                  <div className="text-sm font-semibold">{framework.name}</div>
                </Link>
              ))}
            </div>
          }
        />

        <Step
          title="Create memory store"
          description={
            <div className="flex flex-col gap-4">
              <div>
                If you want to have long-term memory in your AI agents, to save
                messages & conversations between your users and AI agents, you
                need to create a memory store.
              </div>
              <Button
                size="sm"
                variant="light"
                className="border font-semibold"
                endContent={<FaChevronRight size={14} />}
                as={Link}
                href="/data-stores"
              >
                Create memory store
              </Button>
              <Button
                size="sm"
                variant="light"
                className="border font-semibold"
                endContent={<IconExternalLink size={18} />}
                as={Link}
                href="https://docs.scoopika.com/history-stores/get-started"
                target="_blank"
              >
                Usage documentation
              </Button>
            </div>
          }
          tag="next steps"
          time="10 seconds"
          right={
            <Code
              className="min-w-[90%] max-w-[90%]"
              language="typescript"
              code={storeCode}
            />
          }
        />

        <Step
          title="Create knowledge store"
          description={
            <div className="flex flex-col gap-4">
              <div>
                You wan to expand your AI agents knowledge from your files or
                websites? create a knowledge store, add your data, and connect
                it to your AI agent.
              </div>
              <Button
                size="sm"
                variant="light"
                className="border font-semibold"
                endContent={<FaChevronRight size={14} />}
                as={Link}
                href="/knowledge"
              >
                Create knowledge store
              </Button>
            </div>
          }
          tag="next steps"
          time="10 seconds"
          right={
            <Code
              className="min-w-[90%] max-w-[90%]"
              language="typescript"
              code={knowledgeCode}
            />
          }
        />
      </div>
    </>
  );
}
