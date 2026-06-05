"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { submitQuotationRequest, type QuotationActionState } from "@/app/actions/quotation";
import {
  budgetRanges,
  finishOptions,
  furnitureTypes,
  hardwareOptions,
  technical3DProject,
  technicalVisit,
} from "@/lib/quotation/options";
import { Field, inputClass } from "@/components/shared/form-field";
import { ConfirmationCard } from "./confirmation-card";
import { PhotoUploadField } from "./photo-upload-field";

const initialState: QuotationActionState = { ok: false };

export function QuotationForm() {
  const [state, formAction, pending] = useActionState(submitQuotationRequest, initialState);
  const [wantsTechnical3DProject, setWantsTechnical3DProject] = useState(false);
  const [wantsTechnicalVisit, setWantsTechnicalVisit] = useState(false);

  if (state.ok && state.protocol) {
    return <ConfirmationCard protocol={state.protocol} receiptStatus={state.receiptStatus} />;
  }

  const error = (name: string) => state.fieldErrors?.[name]?.[0];

  return (
    <form action={formAction} method="POST" encType="multipart/form-data" className="grid gap-5 rounded-md border border-[var(--line)] bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nome completo" error={error("fullName")}>
          <input className={inputClass} name="fullName" autoComplete="name" />
        </Field>
        <Field label="E-mail" error={error("email")}>
          <input className={inputClass} name="email" type="email" autoComplete="email" />
        </Field>
        <Field label="WhatsApp" error={error("whatsapp")}>
          <input className={inputClass} name="whatsapp" placeholder="(11) 90000-0000" />
        </Field>
        <Field label="Canal preferido" error={error("preferredContactChannel")}>
          <select className={inputClass} name="preferredContactChannel" defaultValue="WHATSAPP">
            <option value="WHATSAPP">WhatsApp</option>
            <option value="EMAIL">E-mail</option>
          </select>
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Tipo de móvel" error={error("furnitureType")}>
          <select className={inputClass} name="furnitureType" defaultValue="">
            <option value="" disabled>Selecione</option>
            {furnitureTypes.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Se escolheu Outro, descreva" error={error("otherFurnitureType")}>
          <input className={inputClass} name="otherFurnitureType" />
        </Field>
        <Field label="Ambiente de instalação" error={error("installationRoom")}>
          <input className={inputClass} name="installationRoom" placeholder="Quarto do casal" />
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Largura (cm)" error={error("approxWidthCm")}>
            <input className={inputClass} name="approxWidthCm" type="number" min="1" />
          </Field>
          <Field label="Altura (cm)" error={error("approxHeightCm")}>
            <input className={inputClass} name="approxHeightCm" type="number" min="1" />
          </Field>
          <Field label="Prof. (cm)" error={error("approxDepthCm")}>
            <input className={inputClass} name="approxDepthCm" type="number" min="1" />
          </Field>
        </div>
      </div>

      <fieldset className="grid gap-3">
        <legend className="text-sm font-semibold">Material / acabamento</legend>
        <div className="grid gap-2 md:grid-cols-2">
          {finishOptions.map((option) => (
            <label className="flex gap-2 text-sm" key={option.value}>
              <input name="desiredFinishes" type="checkbox" value={option.value} />
              {option.label}
            </label>
          ))}
        </div>
        {error("desiredFinishes") ? <p className="text-xs text-red-700">{error("desiredFinishes")}</p> : null}
      </fieldset>

      <fieldset className="grid gap-3">
        <legend className="text-sm font-semibold">Preferências de ferragens</legend>
        <div className="grid gap-2 md:grid-cols-2">
          {hardwareOptions.map((option) => (
            <label className="flex gap-2 text-sm" key={option.value}>
              <input name="hardwarePreferences" type="checkbox" value={option.value} />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <Field label="Descrição adicional" error={error("additionalDescription")}>
        <textarea className={inputClass} name="additionalDescription" rows={4} maxLength={1000} />
      </Field>
      <Field label="Faixa de orçamento">
        <select className={inputClass} name="budgetRange" defaultValue="">
          <option value="">Prefiro não informar</option>
          {budgetRanges.map((range) => (
            <option key={range} value={range}>{range}</option>
          ))}
        </select>
      </Field>

      <fieldset className="grid gap-3 rounded-md border border-[var(--line)] bg-slate-50 p-4">
        <legend className="px-1 text-sm font-semibold">Projeto e visita técnica</legend>
        <label className="flex gap-3 text-sm">
          <input
            checked={wantsTechnical3DProject}
            name="wantsTechnical3DProject"
            onChange={(event) => {
              setWantsTechnical3DProject(event.target.checked);
              if (!event.target.checked) setWantsTechnicalVisit(false);
            }}
            type="checkbox"
          />
          <span>{technical3DProject.label}</span>
        </label>
        {wantsTechnical3DProject ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            {technical3DProject.notice}
          </p>
        ) : null}
        <div
          aria-describedby="technical-visit-help"
          className="grid gap-1"
          tabIndex={wantsTechnical3DProject ? undefined : 0}
          title={wantsTechnical3DProject ? undefined : technicalVisit.disabledHelp}
        >
          <label className={`flex gap-3 text-sm ${wantsTechnical3DProject ? "" : "text-slate-500"}`}>
            <input
              checked={wantsTechnicalVisit}
              disabled={!wantsTechnical3DProject}
              name="wantsTechnicalVisit"
              onChange={(event) => setWantsTechnicalVisit(event.target.checked)}
              type="checkbox"
            />
            <span>{technicalVisit.label}</span>
          </label>
          {!wantsTechnical3DProject ? (
            <p className="text-xs text-[var(--muted)]" id="technical-visit-help">
              {technicalVisit.disabledHelp}
            </p>
          ) : null}
          {error("wantsTechnicalVisit") ? (
            <p className="text-xs text-red-700">{error("wantsTechnicalVisit")}</p>
          ) : null}
        </div>
      </fieldset>

      <Field label="Fotos do ambiente (opcional)">
        <PhotoUploadField />
      </Field>
      <label className="flex gap-3 text-sm">
        <input name="lgpdConsentAccepted" type="checkbox" />
        <span>
          Concordo com a <Link className="font-semibold text-[var(--brand)]" href="/privacidade">Política de Privacidade</Link> e autorizo o uso dos meus dados para elaboração do orçamento.
        </span>
      </label>
      {error("lgpdConsentAccepted") ? <p className="text-xs text-red-700">{error("lgpdConsentAccepted")}</p> : null}
      {state.message && !state.ok ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-800">{state.message}</p> : null}
      <button className="focus-ring rounded-md bg-[var(--brand)] px-5 py-3 font-semibold text-white disabled:opacity-60" disabled={pending}>
        {pending ? "Enviando..." : "Enviar pedido de orçamento"}
      </button>
    </form>
  );
}
