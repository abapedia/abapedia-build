export interface IProject {
  name: string;
  url: string;
  skip?: string;
}

export interface IConfig {
  projects: IProject[];
}

export const config: IConfig = {
  projects: [
    {
      name: "steampunk-2111-api",
      url: "https://github.com/abapedia/steampunk-2111-api",
      skip: "",
    },
    {
      name: "steampunk-2202-api",
      url: "https://github.com/abapedia/steampunk-2202-api",
      skip: "",
    },
    {
      name: "steampunk-2205-api",
      url: "https://github.com/abapedia/steampunk-2205-api",
      skip: "",
    },
    {
      name: "steampunk-2208-api",
      url: "https://github.com/abapedia/steampunk-2208-api",
      skip: "",
    },
    {
      name: "steampunk-2211-api",
      url: "https://github.com/abapedia/steampunk-2211-api",
      skip: "",
    },
    {
      name: "open-abap-core",
      url: "https://github.com/open-abap/open-abap-core",
      skip: "",
    }
  ]
}