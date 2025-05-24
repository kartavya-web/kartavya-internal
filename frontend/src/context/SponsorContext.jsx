import { createContext, useContext, useState } from "react";

const SponsorContext = createContext();

export const SponsorProvider = ({ children }) => {
  const [sponsorId, setSponsorId] = useState(null);
  const [sponsorName, setSponsorName] = useState(null);
  return (
    <SponsorContext.Provider
      value={{ sponsorId, setSponsorId, sponsorName, setSponsorName }}
    >
      {children}
    </SponsorContext.Provider>
  );
};

export const useSponsor = () => useContext(SponsorContext);
