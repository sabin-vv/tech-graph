import { graphql } from "@/generated/graphql"

export const LOGIN = graphql(`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`)

export const CHANGE_PASSWORD = graphql(`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
    )
  }
`)

export const SIGNUP = graphql(`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      token
      user {
        id
        name
        email
      }
    }
  }
`)

export const UPDATE_PROFILE = graphql(`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      name
      email
      jobTitle
      location
      bio
      skills
      avatarUrl
    }
  }
`)
