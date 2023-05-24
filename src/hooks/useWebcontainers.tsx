import { useState, useEffect } from 'react';
import {WebContainer} from "@webcontainer/api";

export function useWebcontainers() {
  const [webcontainerInstance, setWebcontainerInstance] = useState<WebContainer | undefined>();


  useEffect(() => {
    async function handleLoad() {
      const webcontainerInstance_ = await WebContainer.boot();
      setWebcontainerInstance(webcontainerInstance_)
    }

    handleLoad();
  }, []);

  return webcontainerInstance;
}

export default useWebcontainers;