type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }

export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never
    }
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core"
export type CreateKnowledgeInput = {
  description: string
  tags: Array<string>
  title: string
  type: KnowledgeType
  userId: string | number
}

export type KnowledgeType = "algorithm" | "concept" | "database" | "technology"

export type Relation =
  "built_with" | "depends_on" | "extends" | "part_of" | "related_to" | "uses"

export type CreateKnowledgeMutationVariables = Exact<{
  input: CreateKnowledgeInput
}>

export type CreateKnowledgeMutation = {
  createKnowledge: { id: string; title: string }
}

export type GetConnectionsQueryVariables = Exact<{ [key: string]: never }>

export type GetConnectionsQuery = {
  connection: Array<{
    id: string
    userId: string
    relation: Relation
    createdAt: unknown
    updatedAt: unknown
    source: { id: string; title: string }
    target: { id: string; title: string }
  }>
}

export const CreateKnowledgeDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateKnowledge" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "input" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "CreateKnowledgeInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createKnowledge" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "input" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CreateKnowledgeMutation,
  CreateKnowledgeMutationVariables
>
export const GetConnectionsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetConnections" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "connection" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "userId" } },
                { kind: "Field", name: { kind: "Name", value: "relation" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "source" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "target" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetConnectionsQuery, GetConnectionsQueryVariables>
