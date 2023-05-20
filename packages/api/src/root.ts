import { authRouter } from "./router/auth";
import { postRouter } from "./router/post";
import { createTRPCRouter } from "./trpc";
import {plantRouter} from "./router/plant";

export const appRouter = createTRPCRouter({
  post: postRouter,
  auth: authRouter,
  plant: plantRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
