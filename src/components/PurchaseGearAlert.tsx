import React from 'react';
import { IonAlert, IonButton } from '@ionic/react';
import { IWeapon } from '../types/schemas';


interface IPurchaseGearAlertProps {
  isOpen: boolean;
  onDismiss: () => void;
  header: string;
  message: string;
  weapon: IWeapon;
}

function PurchaseGearAlert({ isOpen, onDismiss, ...alertProps }: IPurchaseGearAlertProps) {
  return (
    <IonAlert
      isOpen={isOpen}
      onDidDismiss={onDismiss}
      {...alertProps}
      buttons={[
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Alert canceled');
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            console.log('Alert confirmed');
          },
        },
      ]}
    />
  );
}
export default PurchaseGearAlert;