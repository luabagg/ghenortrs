# M9: B2B Seller Access

Status: planned
Target: 2026-07-10
Depends on: `M3: B2B Lead Capture`, `M7: Design Polish And Navigation Corrections`
Linear milestone: `M9: B2B Seller Access`

## Goal

Create an owned B2B access path for registered sellers instead of sending B2B users to Nuvemshop.

## Linear Issues

- `LUA-54` Define B2B seller access model and auth requirements
- `LUA-55` Create owned `/b2b` route and stop teaser redirects to Nuvemshop — **Done** (2026-05-13)
- `LUA-56` Build B2B registration and follow-up email handoff — blocked by `LUA-54`
- `LUA-57` Implement email SSO for registered sellers — blocked by `LUA-54` and `LUA-56`
- `LUA-58` Create protected B2B access shell after authentication — blocked by `LUA-57`

## Deliverables

- B2B seller access model
- Owned `/b2b` public route
- B2B teaser route update from Nuvemshop to `/b2b`
- Already-registered seller entry-point decision that does not compete with the public teaser CTA
- Seller registration handoff
- Follow-up email path for access
- Email SSO for registered/approved sellers
- Protected B2B shell after authentication

## Included Scope

- Registered-seller access policy
- Placement and copy for an already-registered seller path such as `Já sou cadastrado`
- Email-based SSO or approved equivalent
- Safe states for unknown, pending, invalid, or expired access attempts
- Route and content updates for owned B2B access
- Documentation of required environment variables and public route facts

## Excluded Scope

- Native cart or checkout
- Public B2B catalog without authentication
- Inventory sync or order automation
- Full seller portal beyond the first protected shell

## Progress

2026-05-13:

- `LUA-55` completed: the public B2B teaser now has a single CTA to owned `/b2b`, and it no longer routes B2B users to the Nuvemshop product catalog.
- `/b2b` now exposes only the existing registration request form. The inert access/login-style gate was removed on 2026-07-11 because it implied unavailable authentication.
- Registered-seller entry remains intentionally absent until `LUA-54` defines formal auth requirements and `LUA-57` implements email SSO.

## Exit Criteria

- B2B teaser sends sellers to the owned `/b2b` path.
- Sellers can register or request access before receiving follow-up instructions.
- Already-registered sellers have a defined entry point on `/b2b`, the form success/follow-up flow, or a dedicated login route.
- Only registered/approved sellers can authenticate.
- Protected B2B content is not visible to public users.
- Docs and `public/llms.txt` reflect route and commerce-boundary changes when implemented.

## Recommended Order

1. Define the access model and approval policy.
2. Create the owned `/b2b` route and update teaser navigation.
3. Decide where the already-registered seller entry point belongs.
4. Build registration and follow-up email handoff.
5. Implement email SSO for approved sellers.
6. Build the protected B2B access shell.

## Risks

- Auth implementation needs clear operational ownership for seller approval.
- Email SSO must fail safely for unregistered or expired access attempts.
- B2B access can imply native commerce; copy must preserve the checkout boundary until a later milestone changes it.
- A second B2B teaser CTA can dilute the form path; already-registered access should live deeper in the `/b2b` flow unless the access model decides otherwise.
