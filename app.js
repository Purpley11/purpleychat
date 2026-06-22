// 1. YOUR SUPABASE CONFIGURATION
// You will get these credentials when you create a free Supabase account.
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentMode = 'login';
let currentUser = null;

// Switch between Login and Signup tabs
function switchTab(mode) {
    currentMode = mode;
    document.getElementById('tab-login').classList.toggle('active', mode === 'login');
    document.getElementById('tab-signup').classList.toggle('active', mode === 'signup');
    document.getElementById('username-group').style.display = mode === 'signup' ? 'block' : 'none';
    document.getElementById('submit-btn').innerText = mode === 'login' ? 'Log In' : 'Sign Up';
}

// Handle Sign up / Log In
async function handleAuth(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;
    const errorEl = document.getElementById('auth-error');
    errorEl.innerText = "";

    if (currentMode === 'signup') {
        // Sign Up
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { display_name: username } }
        });
        if (error) return errorEl.innerText = error.message;
        alert("Sign up successful! You can log in now.");
        switchTab('login');
    } else {
        // Log In
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return errorEl.innerText = error.message;
        
        currentUser = data.user;
        showChat();
    }
}

// Show Chat Interface & Start Listening to Messages
function showChat() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('chat-section').style.display = 'block';
    
    loadMessages();
    
    // Listen for new messages in real-time
    supabase
        .channel('public:messages')
        .on('postgres_changes', { event: 'INSERT', pattern: 'public:messages' }, payload => {
            appendMessage(payload.new);
        })
        .subscribe();
}

// Load existing messages from DB
async function loadMessages() {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

    if (!error) {
        const chatBox = document.getElementById('chat-box');
        chatBox.innerHTML = '';
        data.forEach(msg => appendMessage(msg));
    }
}

// Post a new message
async function sendMessage(event) {
    event.preventDefault();
    const input = document.getElementById('message-input');
    const text = input.value.trim();
    if (!text) return;

    const username = currentUser.user_metadata.display_name || currentUser.email;

    await supabase.from('messages').insert([
        { username: username, text: text }
    ]);

    input.value = '';
}

// Add message element to HTML
function appendMessage(msg) {
    const chatBox = document.getElementById('chat-box');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg';
    msgDiv.innerHTML = `<span class="user">${msg.username}:</span> ${msg.text}`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto scroll to bottom
}

// Log out
async function handleLogout() {
    await supabase.auth.signOut();
    location.reload();
}
