import { store } from "@/app/store";
import BenevoleForm from "@/Components/BenevoleForm";
import Scheduler from "@/Components/Scheduler/Scheduler";
import AppLayout from "@/Layouts/AppLayout";
import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { Provider } from "react-redux";

interface Comite {
    id: number;
    nom: string;
    couleur?: string;
    succursale_id: number;
}

export default function Welcome({
    auth,
    comites,
}: PageProps<{ comites: Comite[] }>) {
    return (
        <AppLayout
            props={{
                auth: auth,
            }}
        >
            <Head title="Bénévoles" />
            <div className="main-wrapper px-5 py-3">
                <BenevoleForm comites={comites} />
            </div>
        </AppLayout>
    );
}
