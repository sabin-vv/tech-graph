/* eslint-disable */
import * as types from "./graphql"
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core"

type Documents = {
  "\n  mutation CreateKnowledge($input: CreateKnowledgeInput!) {\n    createKnowledge(input: $input) {\n      id\n      title\n    }\n  }\n": typeof types.CreateKnowledgeDocument
  "\n  query GetConnections {\n    connection {\n      id\n      userId\n      relation\n      source {\n        id\n        title\n      }\n      target {\n        id\n        title\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetConnectionsDocument
}
const documents: Documents = {
  "\n  mutation CreateKnowledge($input: CreateKnowledgeInput!) {\n    createKnowledge(input: $input) {\n      id\n      title\n    }\n  }\n":
    types.CreateKnowledgeDocument,
  "\n  query GetConnections {\n    connection {\n      id\n      userId\n      relation\n      source {\n        id\n        title\n      }\n      target {\n        id\n        title\n      }\n      createdAt\n      updatedAt\n    }\n  }\n":
    types.GetConnectionsDocument,
}

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation CreateKnowledge($input: CreateKnowledgeInput!) {\n    createKnowledge(input: $input) {\n      id\n      title\n    }\n  }\n",
): (typeof documents)["\n  mutation CreateKnowledge($input: CreateKnowledgeInput!) {\n    createKnowledge(input: $input) {\n      id\n      title\n    }\n  }\n"]
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query GetConnections {\n    connection {\n      id\n      userId\n      relation\n      source {\n        id\n        title\n      }\n      target {\n        id\n        title\n      }\n      createdAt\n      updatedAt\n    }\n  }\n",
): (typeof documents)["\n  query GetConnections {\n    connection {\n      id\n      userId\n      relation\n      source {\n        id\n        title\n      }\n      target {\n        id\n        title\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"]

export function graphql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never
