'use server'

import { redirect } from 'next/navigation'
// import { cookies } from "next/headers"

export async function login(prevState: any, formData: FormData): Promise<{
    success: boolean | undefined
    message?: string
} | never> {
    // mock the login details before we implement the actual login endpoint
    const mockUser = {
        email: 'test@test.com',
        password: 'password'
    }

    const email = formData.get('email')
    const password = formData.get('password')

    if (email !== mockUser.email || password !== mockUser.password) {
        return {
            success: false,
            message: 'Invalid email or password'
        }
    }

    // set the authorization token in the cookie
    // cookies().set('Authorization', 'Bearer mockToken')

    // login successful, redirect to the team page
    redirect('/team')
}
