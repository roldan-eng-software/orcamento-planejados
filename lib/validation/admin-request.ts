import { z } from "zod";

export const statusSchema = z.enum(["NOVO", "EM_ANALISE", "ORCADO", "ENCERRADO"]);

export const updateStatusSchema = z.object({
  requestId: z.string().min(1),
  nextStatus: statusSchema,
  expectedStatusVersion: z.coerce.number().int().positive(),
});

export const internalNoteSchema = z.object({
  requestId: z.string().min(1),
  body: z.string().trim().min(1, "Escreva uma nota antes de salvar."),
});

export const anonymizeSchema = z.object({
  requestId: z.string().min(1),
  confirmation: z.literal("ANONIMIZAR"),
});
