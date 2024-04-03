import Image from "next/image";
import {VirginiaMap} from "@/components/VirginiaMap";

export default function Home() {
  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <VirginiaMap width={960} height={600} scale={6000} data={[1, 2, 3]}/>
      </main>
  );
}
