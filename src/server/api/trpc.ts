import { type CreateNextContextOptions } from '@trpc/server/adapters/next';

/** Replace this with an object if you want to pass things to `createContextInner`. */
type CreateContextOptions = {
  req: NextApiRequest;
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  const { req } = opts;
  return { req };
};

export const createTRPCContext = (opts: CreateNextContextOptions) => {
  const { req } = opts;
  return createInnerTRPCContext({
    req
  });
};

import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { type NextApiRequest } from 'next';

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null
      }
    };
  }
});

export const validateCSRF = t.middleware(({ ctx, next }) => {
  // Verify CSRF token
  const csrfCookie = ctx.req.cookies['csrf_token'];
  const csrfToken = ctx.req.headers['x-csrf-token'];
  console.table({
    'CSRF Token (from cookie)': csrfCookie,
    'CSRF Token (from headers)': csrfToken
  });
  if (!csrfToken || csrfToken !== csrfCookie) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Invalid CSRF token' });
  }
  return next();
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(validateCSRF);
