# purpley
chat
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Global Live Chat</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>

    <div class="container">
        <div id="auth-section" class="card">
            <h2>Welcome to Global Chat</h2>
            
            <div class="tabs">
                <button id="tab-login" class="active" onclick="switchTab('login')">Log In</button>
                <button id="tab-signup" onclick="switchTab('signup')">Sign Up</button>
            </div>

            <form id="auth-form" onsubmit="handleAuth(event)">
                <div id="username-group" class="input-group" style="display: none;">
                    <label for="username">Username</label>
                    <input type="text" id="username" placeholder="Choose a username">
                </div>

                <div class="input-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" required placeholder="your@email.com">
                </div>

                <div class="input-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" required placeholder="••••••••">
                </div>

                <button type="submit" id="submit-btn">Log In</button>
            </form>
            <p id="auth-error" class="error"></p>
        </div>

        <div id="chat-section" class="card" style="display: none;">
            <div class="chat-header">
                <h3>Global Room</h3>
                <button onclick="handleLogout()" class="logout-btn">Log Out</button>
            </div>
            
            <div id="chat-box" class="chat-box">
                </div>

            <form id="message-form" onsubmit="sendMessage(event)">
                <input type="text" id="message-input" placeholder="Type a message..." required autocomplete="off">
                <button type="submit">Send</button>
            </form>
        </div>
    </div>

    <script src="app.js"></script>
</body>
</html>
