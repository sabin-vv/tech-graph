import { CodegenConfig } from "@graphql-codegen/cli"
const config: CodegenConfig = {
  schema: "http://localhost:4000/graphql",
  documents: ["src/**/*.{ts,tsx}"],
  generates: {
    "./src/generated/graphql/": {
      preset: "client",
      config: {
        enumsAsConst: true,
      },
    },
  },
}

export default config
