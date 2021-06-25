var config2 = []

const prod = {
    baseURL: `${window.location.origin}`,
    baseLOCATION: "/nptbeta",
  };
  
  const dev = {
    baseURL: "http://localhost:4000",
    baseLOCATION: "",
  };
  

  config2 = process.env.NODE_ENV === `development` ? dev : prod
  config2.AppName = 'NPT Beta'
  config2.appVersion = '1.00'

  export const config = config2

 export const appversion = "v1.62";
