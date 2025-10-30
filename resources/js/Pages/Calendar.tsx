import { store } from "@/app/store";
import Scheduler from "@/Components/Scheduler/Scheduler";
import AppLayout from "@/Layouts/AppLayout";
import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { Provider } from "react-redux";

export default function Welcome({
    auth,
    data,
}: PageProps<{ data: Record<string, any>}>) {
    return (
        <AppLayout
            props={{
                auth: auth,
            }}
        >
            <Head title="Calendrier" />
                <div className="main-wrapper px-5 py-3">
                    <Provider store={store}>
                        <Scheduler data={data} /> 
                    </Provider>
                </div>
        </AppLayout>
    );
}
