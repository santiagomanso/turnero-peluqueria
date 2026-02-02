import Header from "@/components/header";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <main className='bg-linear-to-br from-fuchsia-950 to-purple-900 h-svh w-screen flex items-start justify-center font-archivo pt-10'>
      <section className='bg-linear-to-br from-pink-500 to-fuchsia-950 max-w-4xl flex flex-col justify-center pt-4 pb-8 px-4 sm:w-5/6 lg:w-sm rounded-lg'>
        <Navbar />

        <div className='space-y-5'>
          <Header />
          Content
        </div>
      </section>
    </main>
  );
}
