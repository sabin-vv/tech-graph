/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation CreateKnowledge($input: CreateKnowledgeInput!) {\n    createKnowledge(input: $input) {\n      id\n      title\n    }\n  }\n": typeof types.CreateKnowledgeDocument,
    "\n  mutation CreateConnection($input: CreateConnectionInput!) {\n    createConnection(input: $input) {\n      id\n      userId\n      relation\n      source {\n        id\n        title\n        type\n      }\n      target {\n        id\n        title\n        type\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.CreateConnectionDocument,
    "\n  mutation UpdateConnection($id: ID!, $input: UpdateConnectionInput) {\n    updateConnection(id: $id, input: $input) {\n      id\n      userId\n      relation\n      source {\n        id\n        title\n        type\n      }\n      target {\n        id\n        title\n        type\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.UpdateConnectionDocument,
    "\n  mutation DeleteConnection($id: ID!) {\n    deleteConnection(id: $id)\n  }\n": typeof types.DeleteConnectionDocument,
    "\n  query GetConnections {\n    connections {\n      id\n      userId\n      relation\n      source {\n        id\n        title\n        type\n      }\n      target {\n        id\n        title\n        type\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetConnectionsDocument,
    "\n  query GetConnectionsByKnowledge($id: ID!) {\n    connectionsByKnowledge(id: $id) {\n      id\n      userId\n      relation\n      source {\n        id\n        title\n        type\n      }\n      target {\n        id\n        title\n        type\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": typeof types.GetConnectionsByKnowledgeDocument,
};
const documents: Documents = {
    "\n  mutation CreateKnowledge($input: CreateKnowledgeInput!) {\n    createKnowledge(input: $input) {\n      id\n      title\n    }\n  }\n": types.CreateKnowledgeDocument,
    "\n  mutation CreateConnection($input: CreateConnectionInput!) {\n    createConnection(input: $input) {\n      id\n      userId\n      relation\n      source {\n        id\n        title\n        type\n      }\n      target {\n        id\n        title\n        type\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": types.CreateConnectionDocument,
    "\n  mutation UpdateConnection($id: ID!, $input: UpdateConnectionInput) {\n    updateConnection(id: $id, input: $input) {\n      id\n      userId\n      relation\n      source {\n        id\n        title\n        type\n      }\n      target {\n        id\n        title\n        type\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": types.UpdateConnectionDocument,
    "\n  mutation DeleteConnection($id: ID!) {\n    deleteConnection(id: $id)\n  }\n": types.DeleteConnectionDocument,
    "\n  query GetConnections {\n    connections {\n      id\n      userId\n      relation\n      source {\n        id\n        title\n        type\n      }\n      target {\n        id\n        title\n        type\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetConnectionsDocument,
    "\n  query GetConnectionsByKnowledge($id: ID!) {\n    connectionsByKnowledge(id: $id) {\n      id\n      userId\n      relation\n      source {\n        id\n        title\n        type\n      }\n      target {\n        id\n        title\n        type\n      }\n      createdAt\n      updatedAt\n    }\n  }\n": types.GetConnectionsByKnowledgeDocument,
};

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
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateKnowledge($input: CreateKnowledgeInput!) {\n    createKnowledge(input: $input) {\n      id\n      title\n    }\n  }\n"): (typeof documents)["\n  mutation CreateKnowledge($input: CreateKnowledgeInput!) {\n    createKnowledge(input: $input) {\n      id\n      title\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateConnection($input: CreateConnectionInput!) {\n    createConnection(input: $input) {\n      id\n      userId\n      relation\n      source {\n        id\n        title\n        type\n      }\n      target {\n        id\n        title\n        type\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation CreateConnection($input: CreateConnectionInput!) {\n    createConnection(input: $input) {\n      id\n      userId\n      relation\n      source {\n        id\n        title\n        type\n      }\n      target {\n        id\n        title\n        type\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateConnection($id: ID!, $input: UpdateConnectionInput) {\n    updateConnection(id: $id, input: $input) {\n      id\n      userId\n      relation\n      source {\n        id\n        title\n        type\n      }\n      target {\n        id\n        title\n        type\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateConnection($id: ID!, $input: UpdateConnectionInput) {\n    updateConnection(id: $id, input: $input) {\n      id\n      userId\n      relation\n      source {\n        id\n        title\n        type\n      }\n      target {\n        id\n        title\n        type\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteConnection($id: ID!) {\n    deleteConnection(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteConnection($id: ID!) {\n    deleteConnection(id: $id)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetConnections {\n    connections {\n      id\n      userId\n      relation\n      source {\n        id\n        title\n        type\n      }\n      target {\n        id\n        title\n        type\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetConnections {\n    connections {\n      id\n      userId\n      relation\n      source {\n        id\n        title\n        type\n      }\n      target {\n        id\n        title\n        type\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetConnectionsByKnowledge($id: ID!) {\n    connectionsByKnowledge(id: $id) {\n      id\n      userId\n      relation\n      source {\n        id\n        title\n        type\n      }\n      target {\n        id\n        title\n        type\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"): (typeof documents)["\n  query GetConnectionsByKnowledge($id: ID!) {\n    connectionsByKnowledge(id: $id) {\n      id\n      userId\n      relation\n      source {\n        id\n        title\n        type\n      }\n      target {\n        id\n        title\n        type\n      }\n      createdAt\n      updatedAt\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;