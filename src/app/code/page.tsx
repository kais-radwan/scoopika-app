import Empty from "@/components/main/empty";
import AppHead from "@/components/main/head";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { IconKey } from "@tabler/icons-react";
import { getServerSession, Session } from "next-auth";

export default async function Page() {
  const session = (await getServerSession(authOptions)) as Session;
  const tokens = await db.token.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return (
    <>
      <AppHead
        title="Code"
        description="Code snippets to use Scoopika in your web application"
      />

      {tokens.length < 1 ? (
        <Empty
          title="Generate access token"
          icon={<IconKey />}
          description="You need to generate a token before being able to use Scoopika in your app, click on the settings icon in the top-left corner, generate a token, and add it to your .env file as 'SCOOPIKA_TOKEN'"
        />
      ) : (
        <></>
      )}
    </>
  );
}
