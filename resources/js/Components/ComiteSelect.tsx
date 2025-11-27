import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";

interface ComiteSelectProps {
    comites: Record<string, any>[];
    value: string | number | undefined;
    onChange: (value: string) => void;
    disabled?: boolean;
    error?: string;
}

export default function ComiteSelect({
    comites,
    value,
    onChange,
    disabled = false,
    error,
}: ComiteSelectProps) {
    return (
        <div>
            <InputLabel htmlFor="comiteID" value="Comité" />
            <select
                id="comiteID"
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                disabled={disabled}
                data-testid="select-comite"
            >
                <option value="">-- Sélectionner un comité --</option>
                {comites.map((comite) => (
                    <option key={comite.id} value={comite.id}>
                        {comite.nom}
                    </option>
                ))}
            </select>
            {error && <InputError message={error} data-testid="error-comite" />}
        </div>
    );
}
