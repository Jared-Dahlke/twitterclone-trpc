import type { User } from "@clerk/nextjs/dist/api";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";

export const filterUserForCient = (user: User) => ({
  id: user.id,
  username: user.username,
  profileImageUrl: user.profileImageUrl,
});

export const generateSsgHelper = () =>
  createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });
