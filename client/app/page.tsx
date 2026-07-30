import HomePageHeader from "./components/HomePageHeader";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-background font-sans relative">
      <main className="flex flex-1 w-full flex-col">
        <HomePageHeader />
      </main>
    </div>
  );
}
