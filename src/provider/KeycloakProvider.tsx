import { AuthClientError, AuthClientEvent } from '@react-keycloak/core/';
import { ReactKeycloakProvider as KeycloakProvider } from '@react-keycloak/web';
import keycloak from 'auth/keycloak-api/keycloak';
import EnvVariables from 'helpers/EnvVariables';
import React, { ReactElement } from 'react';
import { trackAuthSuccess } from 'services/analytics';

export interface IProvider {
  children: React.ReactNode;
}

const eventLogger = (eventType: AuthClientEvent, error?: AuthClientError) => {
  if (EnvVariables.configFor('ENV') === 'development' && error) {
    console.error('eventLogger ', 'eventType ', eventType);
    console.error('eventLogger ', error);
  }

  if (eventType === 'onAuthSuccess') {
    trackAuthSuccess();
  }
};

const Keycloak = ({ children }: IProvider): ReactElement => (
  <KeycloakProvider authClient={keycloak} onEvent={eventLogger}>
    {children}
  </KeycloakProvider>
);

export default Keycloak;
