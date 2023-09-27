import { PropsWithChildren } from "react";
import { ServiceContext, ServiceRegistry } from "./ServiceContext";

export interface ServiceProviderProps extends PropsWithChildren {
  serviceRegistry: ServiceRegistry;
}

const ServiceProvider: React.FC<ServiceProviderProps> = ({
  serviceRegistry,
  children,
}) => {
  return (
    <ServiceContext.Provider value={serviceRegistry}>
      {children}
    </ServiceContext.Provider>
  );
};

export default ServiceProvider;
