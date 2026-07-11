import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  B2BFormStatusAlert,
  B2BHoneypotField,
  B2BInputField,
  B2BSubmitButton,
  B2BTextareaField,
} from '@/components/pages/b2b-form-controls';
import {
  type B2BFieldChangeHandler,
  type B2BFields,
  type B2BSubmitHandler,
  type SubmitStatus,
} from '@/components/pages/b2b-form-types';

type B2BFormProps = {
  errors: Partial<B2BFields>;
  fields: B2BFields;
  honeypot: string;
  status: SubmitStatus;
  onFieldChange: B2BFieldChangeHandler;
  onHoneypotChange: (value: string) => void;
  onSubmit: B2BSubmitHandler;
};

export function B2BForm({
  errors,
  fields,
  honeypot,
  status,
  onFieldChange,
  onHoneypotChange,
  onSubmit,
}: B2BFormProps) {
  return (
    <Card className="bg-surface px-0 py-0">
      <CardHeader>
        <CardTitle>Pré-cadastro comercial</CardTitle>
        <CardDescription>
          Informe os dados da empresa e o mix de interesse.
        </CardDescription>
      </CardHeader>
      <form className="grid gap-4 px-6 pb-6" noValidate onSubmit={onSubmit}>
        <B2BHoneypotField value={honeypot} onChange={onHoneypotChange} />
        <B2BInputField
          error={errors.empresa}
          field="empresa"
          id="b2b-company"
          label="Empresa"
          placeholder="Nome da empresa"
          value={fields.empresa}
          onFieldChange={onFieldChange}
        />
        <B2BInputField
          error={errors.cnpj}
          field="cnpj"
          id="b2b-cnpj"
          label="CNPJ"
          placeholder="00.000.000/0000-00"
          value={fields.cnpj}
          onFieldChange={onFieldChange}
        />
        <B2BInputField
          error={errors.telefone}
          field="telefone"
          id="b2b-phone"
          label="Telefone / WhatsApp"
          placeholder="(11) 99999-9999"
          type="tel"
          value={fields.telefone}
          onFieldChange={onFieldChange}
        />
        <B2BInputField
          error={errors.email}
          field="email"
          id="b2b-email"
          label="E-mail"
          placeholder="contato@empresa.com.br"
          type="email"
          value={fields.email}
          onFieldChange={onFieldChange}
        />
        <B2BTextareaField
          id="b2b-needs"
          label="Interesse comercial"
          placeholder="Informe produtos de interesse, volume e tipo de negócio."
          value={fields.mensagem}
          onFieldChange={onFieldChange}
        />
        <B2BFormStatusAlert status={status} />
        <B2BSubmitButton status={status} />
      </form>
    </Card>
  );
}
