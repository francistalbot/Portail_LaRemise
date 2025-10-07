import { store } from "@/app/store";
import { Main } from "@/Components/Main/Main";
import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { Provider } from "react-redux";

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gray-100 text-black">
                <div className="relative flex min-h-screen  flex-col items-center justify-start selection:bg-[#FF2D20] selection:text-white">
                    <div className=" w-full ">
                        <header
                            className="relative top-0 left-0 right-0 z-50 w-full  mx-auto"
                            style={{ backgroundColor: "#FEDB29" }}
                        >
                            <div className="grid grid-cols-3 items-center gap-2 px-10 py-3 max-w-7xl mx-auto">
                                <div></div>
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

                        <Main />

                        <footer className="py-16 text-center text-sm text-black dark:text-white/70">
                            Laravel v{laravelVersion} (PHP v{phpVersion})
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
