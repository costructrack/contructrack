import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { query } from '../../../../lib/db'; 
  
export default NextAuth({
      providers: [
            GoogleProvider({
                  clientId: process.env.GOOGLE_CLIENT_ID,
                  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            }),
      ],
      secret: process.env.NEXTAUTH_SECRET,
      callbacks: {
            async signIn({ user, account, profile, email, credentials }) {
                  try {
                        // Check if user already exists in the database
                        const result = await query('SELECT * FROM "User" WHERE email = $1', [user.email]);
                  
                        if (result.rows.length === 0) {
                              // Insert user into the database
                              await query(
                                    'INSERT INTO "User" (email, username, first_name, last_name) VALUES ($1, $2, $3, $4)',
                                    [user.email, user.name, profile.given_name, profile.family_name]
                              );
                        }
                        return true;
                  } catch (error) {
                        console.error('Error inserting user into database:', error);
                        return false;
                  }
            },
            async session({ session, token, user }) {
                  session.token = token.sub;
                  return session;
            },
            async redirect({ url, baseUrl }) {
                  // Redirect to the homepage after login
                  return baseUrl;
            }
           
      },
});
