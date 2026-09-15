const OLD_API_BASE = process.env.OLD_API_BASE || 'http://127.0.0.1:5000/api';
const NEW_API_BASE = process.env.NEW_API_BASE || 'http://127.0.0.1:8000/api';

const random = Math.random().toString(36).slice(2, 8);
const username = `parity_${random}`;
const password = 'ParityPass123';
const email = `parity_${random}@example.com`;
const fullName = `Parity User ${random.toUpperCase()}`;

const failures = [];

const request = async (base, path, options = {}) => {
  const response = await fetch(`${base}${path}`, options);
  const text = await response.text();

  let body = null;

  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  return {
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    body,
  };
};

const decodeJwtPayload = (token) => {
  if (typeof token !== 'string') {
    return null;
  }

  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
  } catch {
    return null;
  }
};

const normalizeIso = (value) =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)
    ? '<iso8601>'
    : value;

const normalizeError = (body) => {
  if (!body || typeof body !== 'object') {
    return body;
  }

  return {
    statusCode: body.statusCode,
    message: body.message,
    error: body.error,
  };
};

const normalizeUser = (user) => {
  if (!user || typeof user !== 'object') {
    return user;
  }

  return {
    idType: typeof user.id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    createdAt: normalizeIso(user.createdAt),
    updatedAt: normalizeIso(user.updatedAt),
  };
};

const normalizeAuth = (body) => {
  const payload = decodeJwtPayload(body?.token);

  return {
    tokenShape: {
      present: typeof body?.token === 'string',
      subType: typeof payload?.sub,
      username: payload?.username,
      role: payload?.role,
      hasIat: typeof payload?.iat === 'number',
      hasExp: typeof payload?.exp === 'number',
    },
    user: normalizeUser(body?.user),
  };
};

const normalizeMe = (body) => ({
  user: normalizeUser(body?.user),
});

const normalizeHealth = (result) => {
  if (result.status >= 400) {
    return normalizeError(result.body);
  }

  return {
    status: result.body?.status,
    checks: result.body?.checks || null,
    timestamp: normalizeIso(result.body?.timestamp),
  };
};

const normalizeVerify = (body) => {
  if (!body || typeof body !== 'object') {
    return body;
  }

  return {
    verified: body.verified,
    membership: body.membership
      ? {
          registrationNumber: body.membership.registrationNumber,
          certificateNumber: body.membership.certificateNumber,
          fullName: body.membership.fullName,
          grade: body.membership.grade,
          status: body.membership.status,
          validUntil: normalizeIso(body.membership.validUntil),
        }
      : null,
  };
};

const compareCase = (label, oldResult, newResult, normalizer = (value) => value) => {
  const normalizedOld = normalizer(oldResult, oldResult.body);
  const normalizedNew = normalizer(newResult, newResult.body);

  const sameStatus = oldResult.status === newResult.status;
  const sameBody = JSON.stringify(normalizedOld) === JSON.stringify(normalizedNew);

  if (!sameStatus || !sameBody) {
    failures.push({
      label,
      oldStatus: oldResult.status,
      newStatus: newResult.status,
      oldBody: normalizedOld,
      newBody: normalizedNew,
    });
    return;
  }

  console.log(`[parity] PASS ${label}`);
};

const run = async () => {
  console.log(`[parity] old=${OLD_API_BASE}`);
  console.log(`[parity] new=${NEW_API_BASE}`);

  const [oldLive, newLive] = await Promise.all([
    request(OLD_API_BASE, '/health/live'),
    request(NEW_API_BASE, '/health/live'),
  ]);
  compareCase('GET /health/live', oldLive, newLive, normalizeHealth);

  const [oldReady, newReady] = await Promise.all([
    request(OLD_API_BASE, '/health/ready'),
    request(NEW_API_BASE, '/health/ready'),
  ]);
  compareCase('GET /health/ready', oldReady, newReady, normalizeHealth);

  const signupPayload = {
    username,
    password,
    fullName,
    email,
  };

  const [oldSignup, newSignup] = await Promise.all([
    request(OLD_API_BASE, '/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupPayload),
    }),
    request(NEW_API_BASE, '/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupPayload),
    }),
  ]);
  compareCase('POST /auth/signup', oldSignup, newSignup, normalizeAuth);

  const oldToken = oldSignup.body?.token;
  const newToken = newSignup.body?.token;

  const [oldMe, newMe] = await Promise.all([
    request(OLD_API_BASE, '/auth/me', {
      headers: { Authorization: `Bearer ${oldToken}` },
    }),
    request(NEW_API_BASE, '/auth/me', {
      headers: { Authorization: `Bearer ${newToken}` },
    }),
  ]);
  compareCase('GET /auth/me', oldMe, newMe, normalizeMe);

  const [oldLogin, newLogin] = await Promise.all([
    request(OLD_API_BASE, '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }),
    request(NEW_API_BASE, '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }),
  ]);
  compareCase('POST /auth/login', oldLogin, newLogin, normalizeAuth);

  const [oldVerify, newVerify] = await Promise.all([
    request(OLD_API_BASE, '/memberships/verify?registrationNumber=IES-SOM-UNKNOWN'),
    request(NEW_API_BASE, '/memberships/verify?registrationNumber=IES-SOM-UNKNOWN'),
  ]);
  compareCase('GET /memberships/verify?registrationNumber=IES-SOM-UNKNOWN', oldVerify, newVerify, normalizeVerify);

  const [oldForbiddenRegister, newForbiddenRegister] = await Promise.all([
    request(OLD_API_BASE, '/memberships/register', {
      headers: { Authorization: `Bearer ${oldToken}` },
    }),
    request(NEW_API_BASE, '/memberships/register', {
      headers: { Authorization: `Bearer ${newToken}` },
    }),
  ]);
  compareCase('GET /memberships/register as MEMBER', oldForbiddenRegister, newForbiddenRegister, normalizeError);

  if (failures.length > 0) {
    console.error('[parity] FAILED');

    failures.forEach((failure, index) => {
      console.error(`  ${index + 1}. ${failure.label}`);
      console.error(`     old status: ${failure.oldStatus}`);
      console.error(`     new status: ${failure.newStatus}`);
      console.error(`     old body: ${JSON.stringify(failure.oldBody)}`);
      console.error(`     new body: ${JSON.stringify(failure.newBody)}`);
    });

    process.exit(1);
  }

  console.log('[parity] PASSED');
};

run().catch((error) => {
  console.error('[parity] FAILED');
  console.error(`  Unexpected error: ${error?.message || error}`);
  process.exit(1);
});
