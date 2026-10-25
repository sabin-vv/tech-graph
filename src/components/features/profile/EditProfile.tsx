"use client"

import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Textarea from "@/components/ui/Textarea"
import { UPDATE_PROFILE } from "@/graphql/auth/mutations"
import {
  skillsSchema,
  updateProfileSchema,
  type UpdateProfileData,
} from "@/schemas/auth.schema"
import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

const MAX_SKILL_COUNT = 10
const MAX_SKILL_LENGTH = 30

const SKILL_CHIP_CLASS =
  "border-border text-primary bg-primary/10 flex items-center gap-1 rounded-md border px-2 py-1 text-sm"

type ProfileFormData = Omit<UpdateProfileData, "skills">

interface User {
  id: string
  name: string
  email: string
  jobTitle: string | null
  location: string | null
  bio: string | null
  skills: string[]
  avatarUrl: string | null
}

interface EditProfileProps {
  editStatus: (value: boolean) => void
  userData: User
}

const EditProfile = ({ editStatus, userData }: EditProfileProps) => {
  const [pageError, setPageError] = useState<string | null>(null)
  const [skills, setSkills] = useState<string[]>(userData.skills)
  const [skillInput, setSkillInput] = useState("")
  const [skillError, setSkillError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(updateProfileSchema.omit({ skills: true })),
    defaultValues: {
      name: userData.name,
      email: userData.email,
      jobTitle: userData.jobTitle || "",
      location: userData.location || "",
      bio: userData.bio || "",
    },
  })

  const [updateProfile] = useMutation(UPDATE_PROFILE)

  const addSkill = () => {
    const trimmed = skillInput.trim()

    if (!trimmed) {
      return
    }

    if (trimmed.length > MAX_SKILL_LENGTH) {
      setSkillError(`Skill must be ${MAX_SKILL_LENGTH} characters or less`)
      return
    }

    if (skills.length >= MAX_SKILL_COUNT) {
      setSkillError(`Maximum ${MAX_SKILL_COUNT} skills allowed`)
      return
    }

    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkillError("Skill already exists")
      return
    }

    setSkillError(null)
    setSkills([...skills, trimmed])
    setSkillInput("")
  }

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addSkill()
      return
    }

    if (e.key === "Backspace" && !skillInput && skills.length > 0) {
      setSkills(skills.slice(0, -1))
    }
  }

  const onSubmit = async (formData: ProfileFormData) => {
    setPageError(null)

    const parsed = skillsSchema.safeParse(skills)

    if (!parsed.success) {
      setSkillError(parsed.error.issues[0]?.message ?? "Invalid skills")
      return
    }

    try {
      await updateProfile({
        variables: {
          input: {
            ...formData,
            skills: parsed.data,
          },
        },
      })
      editStatus(false)
    } catch (error) {
      setPageError(
        error instanceof Error ? error.message : "Profile updation failed",
      )
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-w-0 flex-1 space-y-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
          About
        </h1>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => editStatus(false)}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </div>

      {pageError && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {pageError}
        </p>
      )}

      <div className="grid min-w-0 grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
        <Input
          label="Name"
          placeholder="e.g., Sabin vv"
          {...register("name")}
          error={errors.name && errors.name.message}
        />
        <Input
          label="Title"
          placeholder="e.g., Full stack developer"
          {...register("jobTitle")}
          error={errors.jobTitle && errors.jobTitle.message}
        />
        <Input
          label="Email"
          placeholder="e.g., user@email.com"
          {...register("email")}
          error={errors.email && errors.email.message}
        />
        <Input
          label="Location"
          placeholder="e.g., India"
          {...register("location")}
          error={errors.location && errors.location.message}
        />
        <Textarea
          label="Bio"
          placeholder="Tell others a little about yourself..."
          {...register("bio")}
          error={errors.bio && errors.bio.message}
        />

        <div className="w-full">
          <label
            htmlFor="skills"
            className="text-text-secondary mb-1 block text-sm font-medium"
          >
            Skills
          </label>

          <div className="border-border bg-background-secondary focus-within:ring-primary flex flex-wrap items-center gap-2 rounded-md border px-3 py-2 focus-within:ring-2 focus-within:ring-offset-0 focus-within:outline-none">
            {skills.map((skill, index) => (
              <span key={`${skill}-${index}`} className={SKILL_CHIP_CLASS}>
                {skill}
                <button
                  type="button"
                  onClick={() =>
                    setSkills(skills.filter((_, i) => i !== index))
                  }
                  aria-label={`Remove ${skill}`}
                  className="hover:text-danger cursor-pointer"
                >
                  <X size={12} aria-hidden="true" />
                </button>
              </span>
            ))}

            <input
              id="skills"
              type="text"
              value={skillInput}
              onChange={(e) => {
                setSkillError(null)
                setSkillInput(e.target.value)
              }}
              onKeyDown={handleSkillKeyDown}
              onBlur={addSkill}
              placeholder={
                skills.length >= MAX_SKILL_COUNT ? "Limit reached" : "Add skill"
              }
              disabled={skills.length >= MAX_SKILL_COUNT}
              className="placeholder-text-muted min-w-24 flex-1 border-none bg-transparent text-base focus-within:outline-hidden"
            />
          </div>

          {skillError && (
            <p className="mt-1 text-sm text-red-400">{skillError}</p>
          )}
        </div>
      </div>
    </form>
  )
}
export default EditProfile
