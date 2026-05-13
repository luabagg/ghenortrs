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
  | 'error'
  | 'no-config';

export type B2BFieldChangeHandler = (
  key: keyof B2BFields,
) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

export type B2BSubmitHandler = (e: FormEvent) => void;
