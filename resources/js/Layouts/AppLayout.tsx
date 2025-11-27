import ApplicationLogo from "@/Components/ApplicationLogo";
import { Head, Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";
import { PageProps } from "@/types";
import { Sidebar } from "./Partials/Sidebar";

export default function AppLayout({
    children,
    props: { auth },
}: PropsWithChildren<{
    props: PageProps;
}>) {
    return (
        <div className="bg-gray-100 text-black">
            <Head>
                <link rel="preload" as="image" href="/images/logo.webp" />
                <link rel="preload" as="image" href="/images/hero.webp" />
            </Head>
            <div className="portal-wrapper">
                <header
                    className="relative top-0 left-0 right-0 z-50 w-full  mx-auto"
                    style={{ backgroundColor: "#FEDB29" }}
                >
                    <div className="grid grid-cols-3 items-center gap-2 px-10 py-3 max-w-7xl mx-auto">
                        <div>
                            <Link href="/">
                                <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                            </Link>
                        </div>
                        <div></div>
                        <nav className="-mx-3 flex flex-1 justify-end">
                            {auth.user ? (
                                <Link
                                    href={route("dashboard")}
                                    className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:hover:text-white/80 dark:focus-visible:ring-white"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route("login")}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20]  dark:hover:text-white/80 dark:focus-visible:ring-white"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route("register")}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:hover:text-white/80 dark:focus-visible:ring-white"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>
                <Sidebar />

                <main className=" main-content e-content-animation h-100 w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
