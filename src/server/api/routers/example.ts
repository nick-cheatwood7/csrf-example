import { z } from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from '~/server/api/trpc';

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`
      };
    }),
  auth: publicProcedure.mutation(() => {
    console.log('🔑 Authing!');
    return {
      message: 'OK!'
    };
  }),
  superSecretAction: protectedProcedure.query(() => {
    return {
      message: "Congrats!  You're CSRF safe!"
    };
  })
});
