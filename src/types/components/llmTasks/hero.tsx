"use client";

import WaitlistDialog from "@/components/joinWaitlist";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import theme from "@/lib/codeTheme";
import tasksTs from "@/components/code/tasksTs";

export default function Hero() {
  return (
    <main className="pt-16 pb-8 min-h-max relative w-full flex justify-center">
      <div className="flex w-full h-full items-center max-w-[90%]">
        <div className="flex flex-col w-full h-full pt-16 w-full">
          <h1 className="text-3xl font-semibold relative z-20 py-2 items-center">
            LLM Tasks for building your agents
          </h1>
          <p className="mt-4 opacity-80 text-base mb-12 pr-6">
            Ready to use APIs for LLM tasks like searching, summarization, and
            custom tasks you define to build your own agents
          </p>
          <WaitlistDialog color="brandgreen" triggerClassName="max-w-max" />
        </div>

        <div className="flex flex-col w-full h-full justify-center items-center pt-16">
          <div className="w-full h-full no-scrollbar overflow-auto max-h-96 bg-black dark:bg-[#121212] rounded-3xl p-2">
            <SyntaxHighlighter
              language="typescript"
              style={theme as any}
              className="min-w-max"
            >
              {tasksTs}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </main>
  );
}
