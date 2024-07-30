"use client";

import AppHead from "../head";
import { FaDatabase } from "react-icons/fa6";
import Empty from "../empty";
import NewHistoryStore from "./new";
import HistoryStoreItem from "./item";

interface Props {
  dataStores: { id: string; name: string }[];
}

export default function StoresMain({ dataStores }: Props) {
  return (
    <>
      <AppHead
        title="Memory Stores"
        description="Store chat sessions for long-term conversations"
        action={<NewHistoryStore />}
      />

      <div className="p-6 pt-0">
        {dataStores.length < 1 && (
          <Empty
            icon={<FaDatabase />}
            title="Create first memory store"
            description="Memory stores are created with one click, and easily used from your code to manage coversation sessions between an AI agent and a user with zero setup. you just pass around conversation sessions IDs"
          />
        )}

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 flex gap-4">
          {dataStores.map((store, index) => (
            <HistoryStoreItem
              key={`storeitem-${store.id}-${index}`}
              datastore={store}
            />
          ))}
        </div>
      </div>
    </>
  );
}
