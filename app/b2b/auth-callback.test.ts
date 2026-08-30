import { describe, expect, it } from 'vitest';

import {
  sellerAuthCallbackRedirect,
  sellerImplicitTokens,
  sellerPkceCode,
  stripSellerAuthParams,
} from './auth-callback';

function url(href: string): URL {
  return new URL(href);
}

describe('sellerAuthCallbackRedirect', () => {
  it('sends a Site URL fallback PKCE landing to /b2b with the code intact', () => {
    expect(
      sellerAuthCallbackRedirect(
        url('http://localhost:3000/?code=133c755f-5ed5-4d6e-b99d-81e57c81d1ea'),
      ),
    ).toBe('/b2b?code=133c755f-5ed5-4d6e-b99d-81e57c81d1ea');
  });

  it('does not bounce when the seller is already on /b2b', () => {
    expect(
      sellerAuthCallbackRedirect(url('http://localhost:3000/b2b?code=abc')),
    ).toBeNull();
  });

  it('does not steal admin or Bling OAuth callbacks', () => {
    expect(
      sellerAuthCallbackRedirect(
        url('http://localhost:3000/admin/login/callback?code=admin-code'),
      ),
    ).toBeNull();
    expect(
      sellerAuthCallbackRedirect(
        url('http://localhost:3000/api/bling-oauth-callback?code=bling-code'),
      ),
    ).toBeNull();
  });

  it('ignores pages without a PKCE code', () => {
    expect(
      sellerAuthCallbackRedirect(url('http://localhost:3000/')),
    ).toBeNull();
  });
});

describe('sellerPkceCode', () => {
  it('reads the seller PKCE code and ignores foreign callbacks', () => {
    expect(
      sellerPkceCode(url('http://localhost:3000/b2b?code=seller-code')),
    ).toBe('seller-code');
    expect(
      sellerPkceCode(
        url('http://localhost:3000/admin/login/callback?code=admin-code'),
      ),
    ).toBeNull();
  });
});

describe('sellerImplicitTokens', () => {
  it('reads the tokens an admin-generated access link leaves in the hash', () => {
    expect(
      sellerImplicitTokens(
        url(
          'http://localhost:3000/b2b/catalogo#access_token=at-1&refresh_token=rt-1&token_type=bearer',
        ),
      ),
    ).toEqual({ accessToken: 'at-1', refreshToken: 'rt-1' });
  });

  it('ignores a hash without both tokens', () => {
    expect(
      sellerImplicitTokens(
        url('http://localhost:3000/b2b/catalogo#access_token=at-1'),
      ),
    ).toBeNull();
    expect(
      sellerImplicitTokens(url('http://localhost:3000/b2b/catalogo')),
    ).toBeNull();
    expect(
      sellerImplicitTokens(
        url('http://localhost:3000/b2b/catalogo#error=access_denied'),
      ),
    ).toBeNull();
  });

  it('does not steal admin or Bling callbacks', () => {
    expect(
      sellerImplicitTokens(
        url(
          'http://localhost:3000/admin/login/callback#access_token=at&refresh_token=rt',
        ),
      ),
    ).toBeNull();
  });
});

describe('stripSellerAuthParams', () => {
  it('removes only the code param so a refresh cannot reuse it', () => {
    expect(
      stripSellerAuthParams(url('http://localhost:3000/b2b?code=abc&keep=1')),
    ).toBe('/b2b?keep=1');
  });

  it('removes the token hash so a refresh cannot replay it', () => {
    expect(
      stripSellerAuthParams(
        url(
          'http://localhost:3000/b2b/catalogo?q=1#access_token=at&refresh_token=rt',
        ),
      ),
    ).toBe('/b2b/catalogo?q=1');
  });
});
