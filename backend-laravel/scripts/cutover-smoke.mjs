const API_BASE = process.env.API_BASE;
const SMOKE_USERNAME = process.env.SMOKE_USERNAME;
const SMOKE_PASSWORD = process.env.SMOKE_PASSWORD;

if (!API_BASE || !SMOKE_USERNAME || !SMOKE_PASSWORD) {
  console.error('Missing required envs: API_BASE, SMOKE_USERNAME, SMOKE_PASSWORD');
  process.exit(1);
}

const failures = [];

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, options);
  const text = await response.text();

  let body = null;

  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  return { status: response.status, body };
};

const check = (condition, message) => {
  if (!condition) {
    failures.push(message);
  }
};

const run = async () => {
  console.log(`[cutover-smoke] api=${API_BASE}`);

  const login = await request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: SMOKE_USERNAME,
      password: SMOKE_PASSWORD,
    }),
  });

  check(login.status === 201, `login expected 201, got ${login.status}`);
  check(typeof login.body?.token === 'string', 'login token missing');
  check(login.body?.user?.username === SMOKE_USERNAME, 'login username mismatch');

  const token = login.body?.token;

  if (typeof token === 'string') {
    const me = await request('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    check(me.status === 200, `me expected 200, got ${me.status}`);
    check(me.body?.user?.username === SMOKE_USERNAME, 'me username mismatch');

    const forbiddenRegister = await request('/memberships/register', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    check(
      forbiddenRegister.status === 403,
      `member register access expected 403, got ${forbiddenRegister.status}`
    );
  }

  const verify = await request('/memberships/verify?registrationNumber=IES-SOM-UNKNOWN');
  check(verify.status === 200, `verify expected 200, got ${verify.status}`);
  check(verify.body?.verified === false, 'verify expected verified=false');

  if (failures.length > 0) {
    console.error('[cutover-smoke] FAILED');

    failures.forEach((failure, index) => {
      console.error(`  ${index + 1}. ${failure}`);
    });

    process.exit(1);
  }

  console.log('[cutover-smoke] PASSED');
};

run().catch((error) => {
  console.error('[cutover-smoke] FAILED');
  console.error(`  Unexpected error: ${error?.message || error}`);
  process.exit(1);
});
