"use client"
import StatCard from "@/components/ui/StatCard"
import { gql } from "@apollo/client"
import { useQuery } from "@apollo/client/react"
import { BookOpen, Brain, Network, Tags } from "lucide-react"
import { useMemo } from "react"

const GET_DASHBOARD_KNOWLEDGE = gql`
  query GetDashboardKnowledge {
    knowledge {
      id
      tags
    }
  }
`

const GET_DASHBOARD_CONNECTIONS = gql`
  query GetDashboardConnections {
    connections {
      id
    }
  }
`

const GET_DASHBOARD_RESOURCES = gql`
  query GetDashboardResources {
    resources {
      id
    }
  }
`

type DashboardKnowledgeData = {
  knowledge: Array<{ id: string; tags: string[] }>
}

type DashboardConnectionsData = {
  connections: Array<{ id: string }>
}

type DashboardResourcesData = {
  resources: Array<{ id: string }>
}

const KnowledgeMetrics = () => {
  const {
    data: knowledgeData,
    error: KnowledgeError,
  } = useQuery<DashboardKnowledgeData>(GET_DASHBOARD_KNOWLEDGE, {
    fetchPolicy: "cache-and-network",
  })

  const {
    data: connectionData,
    error: connectionError,
  } = useQuery<DashboardConnectionsData>(GET_DASHBOARD_CONNECTIONS, {
    fetchPolicy: "cache-and-network",
  })

  const {
    data: resourceData,
    error: resourceError,
  } = useQuery<DashboardResourcesData>(GET_DASHBOARD_RESOURCES, {
    fetchPolicy: "cache-and-network",
  })

  const connection = connectionData?.connections ?? []
  const resource = resourceData?.resources ?? []
  const knowledge = knowledgeData?.knowledge

  const uniqueTagCount = useMemo(() => {
    const tagCount = new Set(
      (knowledge ?? [])
        .flatMap((item) => item.tags ?? [])
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
    )
    return tagCount.size
  }, [knowledge])

  const getValue = (
    error: unknown,
    hasData: boolean,
    count: number,
  ): number | string => {
    if (error) {
      return "--"
    }
    if (!hasData) {
      return "..."
    }
    return count
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Knowledge Items"
        value={getValue(
          KnowledgeError,
          Boolean(knowledgeData),
          knowledge?.length ?? 0,
        )}
        icon={<Brain />}
        footer="Everything you've saved"
      />
      <StatCard
        label="Connections"
        value={getValue(
          connectionError,
          Boolean(connectionData),
          connection.length,
        )}
        icon={<Network />}
        footer="Relationships between knowledge items"
      />
      <StatCard
        label="Resources saved"
        value={getValue(
          resourceError,
          Boolean(resourceData),
          resource.length,
        )}
        icon={<BookOpen />}
        footer="Articles, videos, documentation and more"
      />
      <StatCard
        label="Unique tags"
        value={getValue(
          KnowledgeError,
          Boolean(knowledgeData),
          uniqueTagCount,
        )}
        icon={<Tags />}
        footer="Topics used to organize knowledge"
      />
    </div>
  )
}
export default KnowledgeMetrics
