(() => {
  const config = window.SUPABASE_CONFIG;
  const loginButton = document.getElementById("sendLink");
  const messageList = document.getElementById("messageList");

  if (!config?.url || !config?.publishableKey || !config?.adminEmail || !window.supabase) {
    const status = document.getElementById("loginStatus") || document.getElementById("inboxStatus");
    if (status) status.textContent = "Sign-in is temporarily unavailable. Please try again later.";
    return;
  }

  const client = window.supabase.createClient(config.url, config.publishableKey);
  const ownerEmail = config.adminEmail.toLowerCase();

  if (loginButton) initLogin();
  if (messageList) initInbox();

  async function initLogin() {
    const status = document.getElementById("loginStatus");
    document.getElementById("ownerEmail").textContent = ownerEmail;

    const { data: { user } } = await client.auth.getUser();
    if (user?.email?.toLowerCase() === ownerEmail) {
      location.replace("admin.html");
      return;
    }

    loginButton.addEventListener("click", async () => {
      loginButton.disabled = true;
      status.textContent = "Sending your sign-in link…";
      try {
        const { error } = await client.auth.signInWithOtp({
          email: ownerEmail,
          options: {
            emailRedirectTo: new URL("admin.html", location.href).href,
            shouldCreateUser: true
          }
        });
        if (error) throw error;
        status.textContent = `Check ${ownerEmail} for your secure sign-in link.`;
      } catch (error) {
        console.error("Could not send owner sign-in link:", error);
        status.textContent = "Could not send the sign-in link. Check Supabase Auth email settings and try again.";
      } finally {
        loginButton.disabled = false;
      }
    });
  }

  async function initInbox() {
    const status = document.getElementById("inboxStatus");
    const signedInAs = document.getElementById("signedInAs");
    document.getElementById("signOut").addEventListener("click", async () => {
      await client.auth.signOut();
      location.replace("admin-login.html");
    });

    const { data: { user }, error: authError } = await client.auth.getUser();
    if (authError || !user || user.email?.toLowerCase() !== ownerEmail) {
      await client.auth.signOut({ scope: "local" });
      location.replace("admin-login.html");
      return;
    }

    signedInAs.textContent = `Signed in as ${user.email}`;
    status.textContent = "Loading messages…";

    const { data, error } = await client
      .from("portfolio_contact_messages")
      .select("id, name, email, message, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Could not load contact messages:", error);
      status.textContent = "Could not load messages. Check the table API settings and RLS policy.";
      return;
    }

    status.textContent = data.length ? `${data.length} recent message${data.length === 1 ? "" : "s"}` : "No messages yet.";
    document.getElementById("messageList").replaceChildren(...data.map(createMessageCard));
  }

  function createMessageCard(message) {
    const card = document.createElement("article");
    card.className = "message-card";

    const meta = document.createElement("div");
    meta.className = "message-meta";
    const date = document.createElement("time");
    date.dateTime = message.created_at;
    date.textContent = new Date(message.created_at).toLocaleString();
    meta.append(date);

    const heading = document.createElement("h2");
    heading.textContent = message.name;

    const email = document.createElement("a");
    email.href = `mailto:${message.email}`;
    email.textContent = message.email;

    const body = document.createElement("p");
    body.className = "message-body";
    body.textContent = message.message;

    card.append(meta, heading, email, body);
    return card;
  }
})();

