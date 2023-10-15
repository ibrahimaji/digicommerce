async function verify(userId, code) {
  const res = await fetch("http://localhost:3000/api/v1/auth/verify", {
    method: "POST",
    body: JSON.stringify({ userId, code }),
    cache: "no-store",
  });
  const data = await res.json();
  return data;
}

export default async function Page({ searchParams }) {
  const userId = searchParams.userid;
  const code = searchParams.code;

  const { message, errorMessage } = await verify(userId, code);

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return <div>{message}</div>;
}
