import axios from 'axios';

// Configure these with your Roblox OAuth details
const CLIENT_ID = process.env.CLIENT_ID; // Make sure to set this in your environment variables
const CLIENT_SECRET = process.env.CLIENT_SECRET; // Make sure to set this in your environment variables
const REDIRECT_URI = 'https://rxireland.org/javascript/callback.js'; // This should match your Roblox OAuth settings

export default async function handler(req, res) {
    const authorizationCode = req.query.code;

    if (!authorizationCode) {
        return res.status(400).json({ error: 'Authorization code missing' });
    }

    try {
        // Step 1: Exchange the authorization code for an access token
        const tokenResponse = await axios.post('https://apis.roblox.com/oauth/v1/token', null, {
            params: {
                grant_type: 'authorization_code',
                code: authorizationCode,
                redirect_uri: REDIRECT_URI,
            },
            headers: {
                Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const { access_token } = tokenResponse.data;

        // Step 2: Use the access token to get user information
        const userResponse = await axios.get('https://apis.roblox.com/oauth/v1/userinfo', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const userData = userResponse.data;

        // Step 4: Redirect the user to the homepage after successful login
        return res.redirect('/'); // Redirect to the main page

    } catch (error) {
        console.error('Error during OAuth flow:', error.response ? error.response.data : error.message);
        return res.status(500).json({ error: 'Authentication failed' });
    }
}
