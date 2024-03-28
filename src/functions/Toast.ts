import { IonToast, ToastOptions, useIonToast } from "@ionic/react";
import { HookOverlayOptions } from "@ionic/react/dist/types/hooks/HookOverlayOptions";

interface IToastProps {
    message: string;
    present: {
        (message: string, duration?: number | undefined): Promise<void>;
        (options: ToastOptions & HookOverlayOptions): Promise<void>;
    },
    icon?: string;
}


const GetToast = ({ message, icon, present }: IToastProps) => {

    (message: string) => {
        present({
            message: message,
            duration: 1500,
            color: 'primary',
            icon: icon,
            position: 'bottom',
        });
    };

}

export default GetToast;