import {z} from "zod";

import {createTRPCRouter, protectedProcedure, publicProcedure} from "../trpc";

export const plantRouter = createTRPCRouter({

    all: publicProcedure.query(({ctx}) => {
        return ctx.prisma.plant.findMany({orderBy: {name: "desc"}});
    }),

    byId: publicProcedure
        .input(z.object({id: z.string()}))
        .query(({ctx, input}) => {
            return ctx.prisma.plant.findFirst({where: {id: input.id}});
        }),

    create: protectedProcedure
        .input(
            z.object({
                name: z.string().min(1),
                description: z.string(),
            }),
        )
        .mutation(({ctx, input}) => {
            return ctx.prisma.plant.create(
                {
                    data: {
                        name: input.name,
                        description: input.description,
                        createdById: ctx.session.user.id
                    }
                }
            );
        }),

    delete: protectedProcedure.input(z.string()).mutation(async ({ctx, input}) => {

        const plant = await ctx.prisma.plant.findFirst({where: {id: input}});

        if (!plant) throw new Error("Plant not found");
        if (plant.createdById !== ctx.session.user.id) throw new Error("You can only delete your own plants");

        return ctx.prisma.post.delete({where: {id: input}});
    }),
});
