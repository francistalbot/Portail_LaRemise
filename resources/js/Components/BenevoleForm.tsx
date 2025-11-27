import { useState, FormEvent } from "react";
import { AssignmentSchema } from "@/validation/benevole.schema";
import { z } from "zod";
import axios from "axios";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import ComiteSelect from "@/Components/ComiteSelect";

type BenevoleFormData = z.infer<typeof AssignmentSchema>;

type FormStatus = "empty" | "loading" | "error" | "success";

interface FormErrors {
    Nom?: string[];
    Prenom?: string[];
    Telephone?: string[];
    Email?: string[];
    SlackUserId?: string[];
    ComiteID?: string[];
}

interface Comite {
    id: number;
    nom: string;
    couleur?: string;
    succursale_id: number;
}

interface BenevoleFormProps {
    comites: Record<string, any>[];
}

export default function BenevoleForm({ comites }: BenevoleFormProps) {
    const [status, setStatus] = useState<FormStatus>("empty");
    const [formData, setFormData] = useState<Partial<BenevoleFormData>>({
        Nom: "",
        Prenom: "",
        Telephone: "",
        Email: "",
        SlackUserId: "",
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
            ComiteID: formData.ComiteID ? Number(formData.ComiteID) : undefined,
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
                Nom: "",
                Prenom: "",
                Telephone: "",
                Email: "",
                SlackUserId: "",
            });
        } catch (error: any) {
            setStatus("error");
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({
                    Nom: ["Une erreur est survenue lors de la création"],
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
                        value={formData.Nom || ""}
                        onChange={(e) => handleChange("Nom", e.target.value)}
                        className="mt-1 block w-full"
                        disabled={status === "loading"}
                        data-testid="input-nom"
                    />
                    {errors.Nom && (
                        <InputError
                            message={errors.Nom[0]}
                            data-testid="error-nom"
                        />
                    )}
                </div>

                {/* Prénom */}
                <div>
                    <InputLabel htmlFor="prenom" value="Prénom *" />
                    <TextInput
                        id="prenom"
                        type="text"
                        value={formData.Prenom || ""}
                        onChange={(e) => handleChange("Prenom", e.target.value)}
                        className="mt-1 block w-full"
                        disabled={status === "loading"}
                        data-testid="input-prenom"
                    />
                    {errors.Prenom && (
                        <InputError
                            message={errors.Prenom[0]}
                            data-testid="error-prenom"
                        />
                    )}
                </div>

                {/* Téléphone */}
                <div>
                    <InputLabel htmlFor="telephone" value="Téléphone" />
                    <TextInput
                        id="telephone"
                        type="tel"
                        value={formData.Telephone || ""}
                        onChange={(e) =>
                            handleChange("Telephone", e.target.value)
                        }
                        className="mt-1 block w-full"
                        disabled={status === "loading"}
                        data-testid="input-telephone"
                    />
                    {errors.Telephone && (
                        <InputError
                            message={errors.Telephone[0]}
                            data-testid="error-telephone"
                        />
                    )}
                </div>

                {/* Email */}
                <div>
                    <InputLabel htmlFor="email" value="Courriel" />
                    <TextInput
                        id="email"
                        type="email"
                        value={formData.Email || ""}
                        onChange={(e) => handleChange("Email", e.target.value)}
                        className="mt-1 block w-full"
                        disabled={status === "loading"}
                        data-testid="input-email"
                    />
                    {errors.Email && (
                        <InputError
                            message={errors.Email[0]}
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
                        value={formData.SlackUserId || ""}
                        onChange={(e) =>
                            handleChange("SlackUserId", e.target.value)
                        }
                        className="mt-1 block w-full"
                        disabled={status === "loading"}
                        data-testid="input-slack"
                    />
                    {errors.SlackUserId && (
                        <InputError
                            message={errors.SlackUserId[0]}
                            data-testid="error-slack"
                        />
                    )}
                </div>

                {/* Comité */}
                <ComiteSelect
                    comites={comites}
                    value={formData.ComiteID}
                    onChange={(value) => handleChange("ComiteID", value)}
                    disabled={status === "loading"}
                    error={errors.ComiteID && errors.ComiteID[0]}
                />

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
