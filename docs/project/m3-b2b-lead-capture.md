# M3: B2B Lead Capture

Status: planned
Target: 2026-05-22
Depends on: `M2: Landing Page MVP`
Linear milestone: `M3: B2B Lead Capture`

## Goal

Add the commercial lead path for lojistas, oficinas, revendas, and distributors after the landing page narrative exists.

## Linear Issues

- `LUA-27` Build B2B lead form UI
- `LUA-28` Implement B2B form validation states
- `LUA-29` Connect Resend email delivery
- `LUA-30` Add basic lead form abuse protection

## Deliverables

- B2B lead form UI
- Brazilian phone/WhatsApp and email validation
- Loading, success, and error states using the project component system
- Resend delivery path for valid submissions
- Lightweight abuse protection

## Included Scope

- Frontend form states
- Form validation
- Submit flow
- Email delivery integration
- Honeypot and duplicate-submit protection

## Excluded Scope

- CRM integration
- Account creation
- Automated quotation
- Customer portal
- Inventory sync

## Exit Criteria

- Valid leads can be submitted and delivered to the configured destination.
- Invalid submissions receive clear inline feedback.
- Loading and success states use the established loader/component baseline.
- Missing configuration fails safely without exposing secrets.
- Abuse protection rejects obvious bot or duplicate submissions.

## Recommended Order

1. Build the B2B form UI.
2. Add validation and local submit states.
3. Connect email delivery.
4. Add abuse protection.
5. Verify the flow with configured and missing environment variables.

## Risks

- Starting before M2 is coherent can create a form that does not match the landing-page story.
- Exposing Resend credentials client-side would be a launch blocker.
- Overbuilding account or quote workflows would exceed MVP scope.
