import { useState, FormEvent } from "react";
import { AssignmentSchema } from "@/validation/benevole.schema";
import { z } from "zod";
import axios from "axios";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";

type BenevoleFormData = z.infer<typeof AssignmentSchema>;

type FormStatus = "empty" | "loading" | "error" | "success";

interface FormErrors {
    nom?: string[];
    email?: string[];
    slackUserId?: string[];
    comite_id?: string[];
}

interface BenevoleFormProps {
    comites: Record<string, any>[];
}

export default function BenevoleForm({ comites }: BenevoleFormProps) {
    const [status, setStatus] = useState<FormStatus>("empty");
    const [formData, setFormData] = useState<Partial<BenevoleFormData>>({
        nom: "",
        email: "",
        slackUserId: "",
        comite_id: undefined,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (field: keyof BenevoleFormData, value: string) => {
        setFormData({ ...formData, [field]: value });
        // Effacer l'erreur du champ modifié
        if (errors[field]) {
            setErrors({ ...errors, [field]: undefined });
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setErrors({});
        setSuccessMessage("");

        // Convertir ComiteID en number si présent
        const dataToValidate = {
            ...formData,
            comite_id: formData.comite_id
                ? Number(formData.comite_id)
                : undefined,
        };
        // Validation avec Zod
        const validation = AssignmentSchema.safeParse(dataToValidate);

        if (!validation.success) {
            const formattedErrors = validation.error.format();
            const newErrors: FormErrors = {};

            Object.keys(formattedErrors).forEach((key) => {
                if (key !== "_errors") {
                    newErrors[key as keyof FormErrors] = (
                        formattedErrors as any
                    )[key]._errors;
                }
            });

            setErrors(newErrors);
            setStatus("error");
            return;
        }

        // Envoi à l'API
        try {
            const response = await axios.post(
                "/api/benevoles",
                validation.data
            );
            setStatus("success");
            setSuccessMessage("Bénévole créé avec succès !");
            // Réinitialiser le formulaire
            setFormData({
                nom: "",
                email: "",
                slackUserId: "",
                comite_id: undefined,
            });
        } catch (error: any) {
            setStatus("error");
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({
                    nom: ["Une erreur est survenue lors de la création"],
                });
            }
        }
    };

    return (
        <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-6 text-2xl font-bold text-gray-800">
                Créer un bénévole
            </h2>

            {/* Message de succès */}
            {status === "success" && (
                <div
                    className="mb-4 rounded-md bg-green-50 p-4 text-green-800"
                    data-testid="success-message"
                >
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nom */}
                <div>
                    <InputLabel htmlFor="nom" value="Nom *" />
                    <TextInput
                        id="nom"
                        type="text"
                        value={formData.nom || ""}
                        onChange={(e) => handleChange("nom", e.target.value)}
                        className="mt-1 block w-full"
                        disabled={status === "loading"}
                        data-testid="input-nom"
                    />
                    {errors.nom && (
                        <InputError
                            message={errors.nom[0]}
                            data-testid="error-nom"
                        />
                    )}
                </div>

                {/* Email */}
                <div>
                    <InputLabel htmlFor="email" value="Courriel" />
                    <TextInput
                        id="email"
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="mt-1 block w-full"
                        disabled={status === "loading"}
                        data-testid="input-email"
                    />
                    {errors.email && (
                        <InputError
                            message={errors.email[0]}
                            data-testid="error-email"
                        />
                    )}
                </div>

                {/* Slack User ID */}
                <div>
                    <InputLabel
                        htmlFor="slackUserId"
                        value="Identifiant Slack"
                    />
                    <TextInput
                        id="slackUserId"
                        type="text"
                        value={formData.slackUserId || ""}
                        onChange={(e) =>
                            handleChange("slackUserId", e.target.value)
                        }
                        className="mt-1 block w-full"
                        disabled={status === "loading"}
                        data-testid="input-slack"
                    />
                    {errors.slackUserId && (
                        <InputError
                            message={errors.slackUserId[0]}
                            data-testid="error-slack"
                        />
                    )}
                </div>

                {/* Comité */}
                <div>
                    <InputLabel htmlFor="comiteID" value="Comité" />
                    <select
                        id="comiteID"
                        value={formData.comite_id?.toString() || ""}
                        onChange={(e) =>
                            handleChange("comite_id", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        disabled={status === "loading"}
                        data-testid="select-comite"
                    >
                        <option value="">-- Sélectionner un comité --</option>
                        {comites.map((comite) => (
                            <option key={comite.id} value={comite.id}>
                                {comite.nom}
                            </option>
                        ))}
                    </select>
                    {errors.comite_id && (
                        <InputError
                            message={errors.comite_id[0]}
                            data-testid="error-comite"
                        />
                    )}
                </div>

                {/* Bouton de soumission */}
                <div className="flex items-center justify-end">
                    <PrimaryButton
                        type="submit"
                        disabled={status === "loading"}
                        data-testid="submit-button"
                    >
                        {status === "loading" ? "En cours..." : "Créer"}
                    </PrimaryButton>
                </div>
            </form>

            {/* Indicateur de chargement */}
            {status === "loading" && (
                <div
                    className="mt-4 text-center text-gray-600"
                    data-testid="loading-message"
                >
                    Création en cours...
                </div>
            )}
        </div>
    );
}
