import { type ChangeEvent, type FormEvent } from 'react';

export type B2BFields = {
  empresa: string;
  cnpj: string;
  telefone: string;
  email: string;
  mensagem: string;
};

export type SubmitStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'partial-success'
  | 'error'
  | 'no-config';

export type B2BFieldChangeHandler = (
  key: keyof B2BFields,
) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

export type B2BSubmitHandler = (e: FormEvent<HTMLFormElement>) => void;

export type B2BActionData = {
  status: SubmitStatus;
  errors?: Partial<B2BFields>;
  message?: string;
  gateHint?: string;
};
