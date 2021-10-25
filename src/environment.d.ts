declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_PUBLIC_API_URL: string;
      REACT_APP_PUBLIC_SKILL_WALLET_API_URL: string;
      REACT_APP_PUBLIC_COMMUNITIES_REGISTRY_ADDRESS: string;
      REACT_APP_PUBLIC_RPC_URL: string;
      REACT_APP_PUBLIC_TEXTILE_KEY: string;
      REACT_APP_PUBLIC_TEXTILE_SECRET: string;
      REACT_APP_PUBLIC_BUCKET_NAME: string;
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      PWD: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
