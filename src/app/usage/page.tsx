import AboutFeatureDialog from "@/components/main/aboutFeature";
import Billing from "@/components/main/billing";
import AppHead from "@/components/main/head";
import getPlanData from "@/functions/plans/get";
import getUsage from "@/functions/usage";
import { authOptions } from "@/lib/auth";
import aboutFeatures from "@/scripts/aboutFeatures";
import { readPlan } from "@/scripts/plan";
import { CircularProgress } from "@nextui-org/react";
import { Metadata } from "next";
import { getServerSession, Session } from "next-auth";
import { redirect } from "next/navigation";

export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Usage",
};

const maxes = {
  speech: [150, 100000, 1000000],
  store_read: [0, 1000000, 4000000],
  store_write: [0, 500000, 2000000],
  knowledge: [0, 300000, 1500000],
  listen: [0, 500, 1000],
};

const indexes = ["free", "basic", "scale"];

const Row = ({
  name,
  current,
  max,
  info,
}: {
  name: string;
  current: number;
  max: number;
  info: string;
}) => {
  if (current > max) {
    current = max;
  }

  return (
    <div className="w-full flex flex-col p-3 items-center justify-center border rounded-xl relative bg-accent/10 shadow">
      <CircularProgress
        classNames={{
          svg: "w-24 h-24 drop-shadow-md",
          // indicator: "border",
          track: "border",
          value: "text-lg font-semibold",
        }}
        value={current ?? 0}
        maxValue={max || 1}
        strokeWidth={4}
        showValueLabel
        // label={name}
      />

      <div className="text-sm opacity-90 mb-2 flex items-center gap-3 mt-4 font-semibold">
        {name} 
      </div>
      <div className="text-xs p-1 pl-2 pr-2 rounded-xl border bg-accent/10">
        ({Math.round(current)} out of {max})
      </div>
      <div className="absolute top-2 right-4">
        <AboutFeatureDialog name={name} info={info} />
      </div>
    </div>
  );
};

export default async function Page() {
  const session = (await getServerSession(authOptions)) as Session;
  const plan = readPlan(session.user.plan);
  const planData = await getPlanData(plan.id);
  const usage = await getUsage();
  const usageIndex = indexes.indexOf(plan.type);

  if (plan.type !== "free" && !planData.success) {
    return redirect("/app");
  }

  const usageData: {
    name: string;
    current: number;
    max: number;
    info: string;
  }[] = [
    {
      name: "Speech characters",
      current: usage.data?.[0].value || 0,
      max: maxes.speech[usageIndex],
      info: aboutFeatures.speech,
    },
    {
      name: "Memory stores read operations",
      current: usage?.data?.[1]?.value || 0,
      max: maxes.store_read[usageIndex],
      info: aboutFeatures.store_read,
    },
    {
      name: "Memory stores write operations",
      current: usage?.data?.[2]?.value || 0,
      max: maxes.store_write[usageIndex],
      info: aboutFeatures.store_write,
    },
    {
      name: "Knowledge stores requests",
      current: usage?.data?.[3]?.value || 0,
      max: maxes.knowledge[usageIndex],
      info: aboutFeatures.knowledge,
    },
    {
      name: "Fast audio inputs processes",
      current: usage?.data?.[4]?.value || 0,
      max: maxes.listen[usageIndex],
      info: aboutFeatures.listen,
    },
  ];

  return (
    <>
      <AppHead
        title="Plan & Usage"
        description="Managed your plan and keep track of your monthly usage"
      />
      <div className="p-6 pt-0 w-full flex flex-col gap-6">
        <Billing
          session={session}
          planData={planData.success === true ? planData.data : undefined}
        />
        <div className="w-full border-t-1"></div>
        <div className="p-3 pt-0">
          <div className="font-semibold text-xl pt-4 mb-6">
            Your monthly usage
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 flex gap-6">
            {usageData.map((usage, index) => (
              <Row
                key={`usagerow-${index}`}
                name={usage.name}
                current={usage.current}
                max={usage.max}
                info={usage.info}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
