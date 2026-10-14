import { createContext, useContext } from 'react';

/** Opening the volume: two leaves part to reveal the archive. */
export const OpenArchiveContext = createContext<(to: string) => void>(() => {});
export const useOpenArchive = () => useContext(OpenArchiveContext);
