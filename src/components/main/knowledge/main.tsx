"use client";

import { KnowledgeStore } from "@prisma/client";
import AppHead from "../head";
import Empty from "../empty";
import { IoLibrary } from "react-icons/io5";
import KnowledgeStoreItem from "./item";
import NewKnowledgeStore from "./new";

interface Props {
  stores: KnowledgeStore[];
}

export default function KnowledgeMain({ stores }: Props) {
  return (
    <>
      <AppHead
        title="Knowledge Stores"
        description="Knowledge stores are vector databases with your custom data"
        action={<NewKnowledgeStore />}
      />

      {stores.length < 1 ? (
        <Empty
          icon={<IoLibrary />}
          title="Create first knowledge store"
          description="You can add data to your knowledge store by uploading files or adding websites urls and your agents will have access to this data when needed"
        >
          <NewKnowledgeStore />
        </Empty>
      ) : (
        <div className="w-full flex flex-col gap-3">
          {stores.map((store, index) => (
            <KnowledgeStoreItem key={index} datastore={store} />
          ))}
        </div>
      )}
    </>
  );
}
