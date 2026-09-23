import { CodegenConfig } from "@graphql-codegen/cli"
const config: CodegenConfig = {
  schema: "http://localhost:4000/graphql",
  documents: ["src/graphql/**/*.{ts,tsx,graphql}"],
  generates: {
    "./src/generated/graphql/": {
      preset: "client",
      config: {
        enumsAsConst: true,
        scalars: {
          ID: "string",
          DateTime: "string",
        },
      },
    },
  },
}

export default config
