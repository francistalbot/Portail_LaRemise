import { Assignment } from '@/types/assignment';
import { router } from '@inertiajs/react';
import { useState, useCallback } from 'react';


interface assignmentApiReturn {
    status: string ; // e.g. "success", "error", "loading","idle" etc.
    assignBenevole: (data: Assignment) => Promise<void>;
    updateAffectation: (id: number, data: Partial<Assignment>) => Promise<void>;
    removeAffectation: (id: number) => Promise<void>;
}


export const assignmentApi = (): assignmentApiReturn => {
    const [status, setStatus] = useState<string>('idle');

    const handleSuccess = () => {
        setStatus('success');
        setTimeout(() => setStatus('idle'), 2000);
    };

    const handleError = () => {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 2000);
    } ;

    const assignBenevole = async (data: Assignment) => {
        setStatus('loading');
        try {
            await new Promise<void>((resolve, reject) => {
                router.post('/api/affectations', data as any, {
                    onSuccess: (response) => {
                        handleSuccess();
                        resolve();
                    },
                    onError: (errors) => {
                        handleError();
                        reject(errors);
                    },
                    onFinish: () => setStatus('idle'),
                });
            });
        } catch (error) {
            handleError();
            throw error;
        }
    };

    /**
     * Mettre à jour une affectation existante
     */
    const updateAffectation = async (id: number, data: Partial<Assignment>) => {
        setStatus('loading');

        try {
            await new Promise<void>((resolve, reject) => {
                router.put(`/api/affectations/${id}`, data as any, {
                    onSuccess: (response) => {
                        handleSuccess();
                        resolve();
                    },
                    onError: (errors) => {
                        handleError();
                        reject(errors);
                    },
                    onFinish: () => setStatus('idle'),
                });
            });
        } catch (error) {
            handleError();
            throw error;
        }
    };

    /**
     * Supprimer une affectation (désaffecter)
     */
    const removeAffectation = async (id: number) => {
        setStatus('loading');

        try {
            await new Promise<void>((resolve, reject) => {
                router.delete(`/api/affectations/${id}`, {
                    onSuccess: (response) => {
                        handleSuccess();
                        resolve();
                    },
                    onError: (errors) => {
                        handleError();
                        reject(errors);
                    },
                    onFinish: () => setStatus('idle'),
                });
            });
        } catch (error) {
            handleError();
            throw error;
        }
    };

   
    return {
        status,
        assignBenevole,
        updateAffectation,
        removeAffectation,
    };
};