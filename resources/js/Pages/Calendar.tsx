import { store } from "@/app/store";
import Scheduler from "@/Components/Scheduler/Scheduler";
import AppLayout from "@/Layouts/AppLayout";
import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { Provider } from "react-redux";

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <AppLayout
            props={{
                auth: auth,
                laravelVersion: laravelVersion,
                phpVersion: phpVersion,
            }}
        >
            <Head title="Welcome" />
            <main className=" main-content e-content-animation">
                <div className="main-wrapper px-5 py-3">
                    <Provider store={store}>
                        <Scheduler />
                    </Provider>
                </div>
            </main>
        </AppLayout>
    );
}
