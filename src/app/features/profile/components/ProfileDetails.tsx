"use client"
import { ME } from "@/graphql/auth/queries"
import { GET_KNOWLEDGE } from "@/graphql/knowledge/queries"
import { GET_RESOURCES } from "@/graphql/resource/queries"
import { useQuery } from "@apollo/client/react"
import Button from "@/components/ui/Button"
import { Mail, MapPin, Pen } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import EditProfile from "./EditProfile"

const SKILL_CHIP_CLASS =
  "border-border text-primary bg-primary/10 rounded-md border px-3 py-1 text-sm"

interface StatCardProps {
  label: string
  value: number
  loading: boolean
}

const StatCard = ({ label, value, loading }: StatCardProps) => (
  <div className="border-border bg-surface flex flex-col gap-1.5 rounded-lg border p-5">
    <span className="text-text-secondary text-sm font-medium tracking-wider uppercase">
      {label}
    </span>
    <span className="text-3xl leading-none font-bold tabular-nums sm:text-4xl">
      {loading ? "—" : value}
    </span>
  </div>
)

const ProfileDetails = () => {
  const [editForm, setEditForm] = useState<boolean>(false)
  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(ME)

  const { data: knowledgeData, loading: knowledgeLoading } =
    useQuery(GET_KNOWLEDGE)

  const { data: resourceData, loading: resourceLoading } =
    useQuery(GET_RESOURCES)

  const user = userData?.me

  if (userLoading) {
    return <p className="text-text-secondary text-sm">Loading Profile...</p>
  }

  if (userError || !user) {
    return (
      <p className="text-danger text-sm">
        Failed to load profile. Please try again.
      </p>
    )
  }

  const knowledgeCount = knowledgeData?.knowledge.length ?? 0
  const resourceCount = resourceData?.resources.length ?? 0

  return (
    <div className="space-y-5">
      <div className="border-border bg-surface flex flex-col gap-5 rounded-lg border p-5 sm:flex-row sm:items-start sm:gap-8 sm:p-6">
        <Image
          className="border-border bg-surface-elevated shrink-0 rounded-full border"
          src="/image/MyProfile.png"
          alt={`${user.name}'s profile picture`}
          width={96}
          height={96}
          sizes="96px"
          preload
        />

        {editForm ? (
          <EditProfile editStatus={setEditForm} userData={user} />
        ) : (
          <>
            <div className="flex w-full justify-between gap-5">
              <div className="min-w-0 flex-1 space-y-4">
                <div className="space-y-1.5">
                  <h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
                    {user.name}
                  </h1>

                  <p className="text-text-secondary text-base">
                    {user.jobTitle}
                  </p>

                  <div className="text-text-muted flex flex-wrap items-center gap-x-5 gap-y-1 text-base">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} aria-hidden="true" />
                      {user.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail size={14} aria-hidden="true" />
                      {user.email}
                    </span>
                  </div>
                </div>

                <p className="text-text-secondary max-w-prose text-base leading-relaxed">
                  {user.bio}
                </p>

                <ul className="flex flex-wrap gap-2">
                  {user.skills.map((skill) => (
                    <li key={skill} className={SKILL_CHIP_CLASS}>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant="primary"
                onClick={() => setEditForm(true)}
                className="gap-2 self-start text-base"
              >
                <Pen size={16} aria-hidden="true" />
                Edit
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <StatCard
          label="Knowledge Items"
          value={knowledgeCount}
          loading={knowledgeLoading}
        />
        <StatCard
          label="Resources"
          value={resourceCount}
          loading={resourceLoading}
        />
      </div>
    </div>
  )
}
export default ProfileDetails
