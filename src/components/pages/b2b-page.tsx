import { B2BForm } from '@/components/pages/b2b-form';
import {
  B2BAccessHeroSection,
  B2BLeadIntroSection,
  B2BSuccessSection,
} from '@/components/pages/b2b-page-sections';
import { useB2BLeadForm } from '@/components/pages/use-b2b-lead-form';

export function B2BPage() {
  const {
    errors,
    fields,
    handleFieldChange,
    handleSubmit,
    honeypot,
    setHoneypot,
    status,
  } = useB2BLeadForm();

  if (status === 'success') {
    return <B2BSuccessSection />;
  }

  return (
    <div className="grid gap-12">
      <B2BAccessHeroSection />
      <section
        className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]"
        id="cadastro"
      >
        <B2BLeadIntroSection />
        <B2BForm
          errors={errors}
          fields={fields}
          honeypot={honeypot}
          status={status}
          onFieldChange={handleFieldChange}
          onHoneypotChange={setHoneypot}
          onSubmit={handleSubmit}
        />
      </section>
    </div>
  );
}
