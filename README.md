# OrcaFlex

Plataforma de orcamento para moveis planejados que evolui em tres versoes:
captacao de leads com orcamento manual, motor de orcamento automatico
MicroSaaS e e-commerce DIY de kits flat-pack.

A governanca do projeto esta definida em `.specify/memory/constitution.md`.

## Desenvolvimento

```bash
npm install
npm run db:generate
npm run dev
```

Copie `.env.example` para `.env.local` e preencha as variaveis de Supabase,
Postgres e SMTP antes de testar submissao real de pedidos.

## Validacao

```bash
npm run lint
npm run test
npm run build
npm run test:e2e
```

O MVP V1 cobre landing page, formulario publico com protocolo, painel admin,
paginas de privacidade/contato e contratos de anonimização LGPD.
